// 마크다운에서 "/"로 시작하는 내부 경로(src/href)에 base 경로를 붙이는 rehype 플러그인.
// 예: base가 "/Homepage"이면 ![](/images/a.png) → /Homepage/images/a.png
export function rehypeBasePath({ base = '/' } = {}) {
  const prefix = base.replace(/\/+$/, '');
  const fix = (url) => {
    if (!prefix || typeof url !== 'string') return url;
    if (!url.startsWith('/') || url.startsWith('//')) return url;
    if (url === prefix || url.startsWith(prefix + '/')) return url;
    return prefix + url;
  };
  const walk = (node) => {
    if (node.type === 'element' && node.properties) {
      for (const key of ['src', 'href']) {
        if (key in node.properties) node.properties[key] = fix(node.properties[key]);
      }
    }
    if (node.children) node.children.forEach(walk);
  };
  return (tree) => walk(tree);
}
