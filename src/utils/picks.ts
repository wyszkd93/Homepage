// 피드 목록: 탭(AI, DB)별로 최신순
import { getCollection } from 'astro:content';

export type PickTopic = 'ai' | 'db';
export const PICK_TOPICS: { id: PickTopic; label: string; name: string; base: string; desc: string }[] = [
  { id: 'ai', label: 'AI', name: 'AI 피드', base: '/picks/', desc: '모구가 골라 읽고 한국어로 정리한 AI 도구와 소식' },
  { id: 'db', label: 'DB', name: 'DB 피드', base: '/picks/db/', desc: '모구가 골라 읽고 한국어로 정리한 DB 도구와 소식' },
];
export const topicOf = (id: PickTopic) => PICK_TOPICS.find((t) => t.id === id)!;

export async function picksOf(topic: PickTopic) {
  return (await getCollection('picks', (p) => p.data.topic === topic)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
