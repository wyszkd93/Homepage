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
  life: [[0, 2, 1, 2, 0, 2, 1, 2], [2, 1, 0, 1, 2, -1, 2, 1], [0, 1, 2, 1, 2, 1, 0, 2], [1, 2, -1, 2, 1, 0, 2, 0]],
  senior: [[0, -1, 1, -1, 2, -1, 1, -1], [2, -1, -1, 1, 0, -1, -1, -1]],
  ending: [[0, -1, 1, -1, 2, -1, -1, -1], [2, -1, 1, -1, 0, -1, -1, -1]],
};
const BPM: Record<Mood, number> = { life: 120, senior: 84, ending: 66 };

export class Bgm {
  private ctx: AudioContext | null = null;
  private noise: AudioBuffer | null = null;
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
    // 하이햇용 짧은 잡음
    const nb = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
    const ch = nb.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    this.noise = nb;
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
    // 페이드 중에 다시 start()해도 새 타이머는 지우지 않도록 지금 타이머만 멈춥니다.
    const timer = this.timer;
    window.setTimeout(() => clearInterval(timer), fade * 1000 + 50);
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
      const t = this.nextTime;
      if (this.mood === 'life') {
        // 통통 튀는 베이스: 근음 - 5도 - 옥타브 - 5도
        const bassStep = [1, 0, 1.5, 0, 2, 0, 1.5, 0][this.step];
        if (bassStep) this.tone(NOTE[bass] * bassStep, t, eighth * 1.6, 'sine', this.step === 0 ? 0.5 : 0.32);
        // 가벼운 드럼: 박마다 킥, 엇박에 하이햇, 2·4박에 손뼉
        if (this.step % 4 === 0) this.kick(t);
        if (this.step % 2 === 1) this.hat(t, 0.05);
        if (this.step === 2 || this.step === 6) this.hat(t, 0.12, 1800);
      } else {
        if (this.step === 0) this.tone(NOTE[bass], t, eighth * 7, 'sine', 0.5);
        if (this.mood === 'senior' && this.step === 4) this.tone(NOTE[bass] * 1.5, t, eighth * 3, 'sine', 0.22);
      }
      if (i >= 0) this.tone(NOTE[chord[i]], this.nextTime, eighth * 3, 'triangle', 0.32);
      // 가끔 한 옥타브 위 반짝임
      if (i >= 0 && this.mood !== 'ending' && Math.random() < (this.mood === 'life' ? 0.22 : 0.1)) this.tone(NOTE[chord[i]] * 2, this.nextTime + eighth / 2, eighth * 2, 'sine', 0.1);
      this.nextTime += eighth;
      this.step = (this.step + 1) % 8;
      if (this.step === 0) this.bar++;
    }
  }

  private kick(t: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.45, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(g).connect(this.master!);
    o.start(t);
    o.stop(t + 0.18);
  }

  private hat(t: number, vol: number, cutoff = 7000) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = cutoff;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    src.connect(f).connect(g).connect(this.master!);
    src.start(t);
    src.stop(t + 0.06);
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
