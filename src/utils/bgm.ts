// 견생 한 바퀴 배경음악: 파일 없이 WebAudio로 만드는 잔잔한 오르골 + 베이스.
// mood: life(평소) → senior(노견, 느리고 낮게) → ending(마지막 장면, 단조 느낌)
export type Mood = 'life' | 'senior' | 'ending';

const NOTE: Record<string, number> = {};
['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].forEach((n, i) => {
  for (let o = 2; o <= 6; o++) NOTE[`${n}${o}`] = 440 * Math.pow(2, (i - 9 + (o - 4) * 12) / 12);
});

// 마디마다 [베이스, 화음 3음]
const PROG: Record<Mood, [string, string[]][]> = {
  life: [['C3', ['C5', 'E5', 'G5']], ['G2', ['B4', 'D5', 'G5']], ['A2', ['A4', 'C5', 'E5']], ['F2', ['A4', 'C5', 'F5']]],
  senior: [['F2', ['A4', 'C5', 'F5']], ['C3', ['G4', 'C5', 'E5']], ['D3', ['A4', 'D5', 'F5']], ['G2', ['B4', 'D5', 'G5']]],
  ending: [['A2', ['A4', 'C5', 'E5']], ['F2', ['A4', 'C5', 'F5']], ['C3', ['G4', 'C5', 'E5']], ['G2', ['B4', 'D5', 'G5']]],
};
// 한 마디 8칸(8분음표)마다 화음의 몇 번째 음을 칠지 (-1은 쉼)
const PATTERN: Record<Mood, number[][]> = {
  life: [[0, 1, 2, 1, 0, 2, 1, 2], [2, -1, 1, 0, 1, -1, 2, 1], [0, 2, 1, 2, 0, -1, 2, -1]],
  senior: [[0, -1, 1, -1, 2, -1, 1, -1], [2, -1, -1, 1, 0, -1, -1, -1]],
  ending: [[0, -1, 1, -1, 2, -1, -1, -1], [2, -1, 1, -1, 0, -1, -1, -1]],
};
const BPM: Record<Mood, number> = { life: 96, senior: 76, ending: 66 };

export class Bgm {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer = 0;
  private nextTime = 0;
  private step = 0;
  private bar = 0;
  mood: Mood = 'life';
  playing = false;

  private ensure() {
    if (this.ctx) return this.ctx;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    // 살짝 울리는 느낌 (짧은 딜레이 메아리)
    const delay = this.ctx.createDelay();
    delay.delayTime.value = 0.28;
    const fb = this.ctx.createGain();
    fb.gain.value = 0.25;
    delay.connect(fb).connect(delay);
    this.master.connect(this.ctx.destination);
    this.master.connect(delay).connect(this.ctx.destination);
    return this.ctx;
  }

  /** 사용자가 버튼을 눌렀을 때 호출해야 소리가 납니다(브라우저 자동 재생 정책). */
  start() {
    const ctx = this.ensure();
    if (ctx.state === 'suspended') void ctx.resume();
    if (this.playing) return;
    this.playing = true;
    this.nextTime = ctx.currentTime + 0.1;
    this.step = 0;
    this.master!.gain.cancelScheduledValues(ctx.currentTime);
    this.master!.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.2);
    this.timer = window.setInterval(() => this.schedule(), 40);
  }

  stop(fade = 0.6) {
    if (!this.ctx || !this.playing) return;
    this.playing = false;
    const t = this.ctx.currentTime;
    this.master!.gain.cancelScheduledValues(t);
    this.master!.gain.setValueAtTime(this.master!.gain.value, t);
    this.master!.gain.linearRampToValueAtTime(0, t + fade);
    window.setTimeout(() => clearInterval(this.timer), fade * 1000 + 50);
  }

  setMood(m: Mood) {
    if (this.mood === m) return;
    this.mood = m;
    this.bar = 0;
    this.step = 0;
  }

  /** 다른 탭에 가면 잠시 멈췄다가 돌아오면 이어서 */
  suspend(on: boolean) {
    if (!this.ctx) return;
    if (on) void this.ctx.suspend();
    else if (this.playing) {
      void this.ctx.resume();
      this.nextTime = this.ctx.currentTime + 0.1;
    }
  }

  private schedule() {
    const ctx = this.ctx!;
    const eighth = 60 / BPM[this.mood] / 2;
    while (this.nextTime < ctx.currentTime + 0.15) {
      const prog = PROG[this.mood];
      const [bass, chord] = prog[this.bar % prog.length];
      const pats = PATTERN[this.mood];
      const pat = pats[Math.floor(this.bar / prog.length) % pats.length];
      const i = pat[this.step];
      if (this.step === 0) this.tone(NOTE[bass], this.nextTime, eighth * 7, 'sine', 0.5);
      if (this.step === 4 && this.mood === 'life') this.tone(NOTE[bass] * 1.5, this.nextTime, eighth * 3, 'sine', 0.25);
      if (i >= 0) this.tone(NOTE[chord[i]], this.nextTime, eighth * 3, 'triangle', 0.32);
      // 가끔 한 옥타브 위 반짝임
      if (i >= 0 && this.mood !== 'ending' && Math.random() < 0.12) this.tone(NOTE[chord[i]] * 2, this.nextTime + eighth / 2, eighth * 2, 'sine', 0.1);
      this.nextTime += eighth;
      this.step = (this.step + 1) % 8;
      if (this.step === 0) this.bar++;
    }
  }

  private tone(freq: number, t: number, dur: number, type: OscillatorType, vol: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012); // 오르골처럼 톡
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g).connect(this.master!);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
}
