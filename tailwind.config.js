/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // --- 全体 (Base) ---
            maxWidth: '100%',
            // noteはかなり黒に近いグレー(#222など)を使う
            color: theme('colors.gray.900'),
            lineHeight: '1.9', // ゆったりとした行間
            fontSize: '1.125rem', // ベースを18px寄りに意識

            // --- リンク (Link) ---
            // noteは緑系だが、君のブログのテーマカラーに合わせて青のまま、シンプルに
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'underline',
              textDecorationColor: theme('colors.blue.200'),
              textUnderlineOffset: '4px', // 下線を少し離すのがモダン
              transition: 'all 0.2s ease',
              '&:hover': {
                color: theme('colors.blue.800'),
                textDecorationColor: theme('colors.blue.800'),
                backgroundColor: 'transparent',
              },
            },

            // --- 見出し (Headings) ---
            // note流：装飾（下線）をなくし、圧倒的な余白と太さで区切る
            h2: {
              color: theme('colors.gray.900'),
              fontSize: '1.6em', // 極端に大きくしすぎない
              fontWeight: '700', // しっかり太く
              marginTop: '3.5em', // 上の余白を強烈に取る
              marginBottom: '1em',
              paddingBottom: '0', // 下線用のパディングを削除
              borderBottom: 'none', // 下線を削除（noteスタイル）
              lineHeight: '1.4',
            },
            h3: {
              color: theme('colors.gray.900'),
              fontSize: '1.4em',
              fontWeight: '700',
              marginTop: '2.5em',
              marginBottom: '0.8em',
              lineHeight: '1.5',
            },
            // h4以降も太くして存在感を出す
            h4: {
              color: theme('colors.gray.900'),
              fontSize: '1.2em',
              fontWeight: '700',
              marginTop: '2em',
              marginBottom: '0.5em',
            },

            // --- 段落 (Paragraph) ---
            p: {
              marginTop: '1.5em', // 段落間のリズムを一定に
              marginBottom: '1.5em',
            },

            // --- リスト (List) ---
            ul: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
              paddingLeft: '1.5em',
              color: theme('colors.gray.800'),
            },
            ol: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
              paddingLeft: '1.5em',
              color: theme('colors.gray.800'),
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },

            // --- 引用 (Blockquote) ---
            // noteの引用はシンプルで薄いグレーの背景
            blockquote: {
              marginTop: '2.5em',
              marginBottom: '2.5em',
              paddingLeft: '1.5em',
              borderLeftWidth: '4px',
              borderLeftColor: theme('colors.gray.300'), // ニュートラルな色
              backgroundColor: theme('colors.gray.50'),
              paddingTop: '1em',
              paddingBottom: '1em',
              paddingRight: '1em',
              color: theme('colors.gray.600'),
              fontStyle: 'normal',
              quotes: 'none',
              borderRadius: '4px',
            },

            // --- 画像 (Image / Figure) ---
            img: {
              marginTop: '3em',
              marginBottom: '1em', // キャプションとの距離を縮める
              borderRadius: '4px', // 角丸は控えめに
              boxShadow: 'none', // noteは影を使わない（フラット）
              border: `1px solid ${theme('colors.gray.100')}`, // 薄い枠線で境界を示す
            },
            figcaption: {
              color: theme('colors.gray.500'),
              fontSize: '0.875em',
              textAlign: 'center',
              marginTop: '0.5em',
              marginBottom: '3em',
            },

            // --- コード (Code) ---
            code: {
              color: theme('colors.red.600'),
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2em 0.4em',
              borderRadius: '4px',
              fontWeight: '400',
              fontSize: '0.9em',
              border: `1px solid ${theme('colors.gray.200')}`,
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },

            // --- 強調 (Strong) ---
            // noteはシンプルに太字のみ（蛍光ペンなどは使わない）
            strong: {
              color: theme('colors.gray.900'),
              fontWeight: '700',
              background: 'none',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};