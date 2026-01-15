// app/test/page.jsx
import React from 'react';

// すべての要素を網羅した「最強のダミーHTML」
// APIにはないけど将来出るかもしれない要素も入れておくのが「転ばぬ先の杖」だよ。
const fullTestContent = `
  <h1>これはH1タイトル（通常は記事タイトルとして使われる）</h1>
  <p>これは標準の段落テキストです。microCMSのリッチエディタから出力される標準的な文章の見た目を確認します。<br>改行が入った場合はどうなるかもチェック。</p>
  
  <h2 id="h2">これはH2見出し（大見出し）</h2>
  <p>H2の下の余白や、ボーダーラインの見た目を確認。<strong>太字（strong）</strong>や<b>太字（b）</b>、<u>下線（u）</u>の表示もチェック。</p>
  
  <h3 id="h3">これはH3見出し（中見出し）</h3>
  <p>H3はH2より少し小さくあるべきだね。<a href="#">これはリンクのスタイル</a>です。マウスオーバー時の挙動も確認して。</p>
  
  <h4 id="h4">これはH4見出し（小見出し：未定義！）</h4>
  <p>APIのJSONに含まれていたけどスタイルがなかったやつだね。</p>

  <h5 id="h5">これはH5見出し</h5>
  <p>使う頻度は低いけど、念のため定義しておこう。</p>

  <ul>
    <li>リスト（ul/li）の項目1</li>
    <li>リストの項目2：<a href="#">リンク入り</a></li>
    <li>リストの項目3</li>
  </ul>

  <ol>
    <li>番号付きリスト（ol/li）の項目1</li>
    <li>番号付きリストの項目2</li>
  </ol>

  <blockquote>
    <p>これは引用（blockquote）です。以前のコードではタイプミスがあったから修正が必要だよ。背景色や左側のバーのデザインを確認して。</p>
  </blockquote>

  <p>以下はショートカットキーの説明などで使うコード表示：</p>
  <p>検索するには <code>Ctrl + F</code> を押してください。</p>

  <p>以下は画像とキャプション（figure/figcaption）：</p>
  <figure>
    <img src="https://placehold.co/600x400" alt="ダミー画像" />
    <figcaption>これは画像のキャプション（figcaption）です。画像の中央下に小さく出るべき。</figcaption>
  </figure>
`;

export default function TestPage() {
  return (
    <div className="min-h-screen bg-white font-sans py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-10 text-center">スタイル定義テストベンチ</h1>
        
        {/* ここにスタイルを当てていく */}
        <div
 className="prose prose-lg md:prose-xl prose-slate max-w-none"
 dangerouslySetInnerHTML={{ __html: fullTestContent }}
/>
      </div>
    </div>
  );
}