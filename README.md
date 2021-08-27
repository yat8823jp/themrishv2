# themrish v2.1

for WordPress theme develop auxiliary tool

WordPressのテーマ開発補助ツールです。

ブラウザシンクによるソースファイル保存時のページリロード
sassコンパイラ ( dart-sass )
jsコンパイラ

## ディレクトリ構成

```
root
├─ public            # WordPress main body storage directory
|  ├─ wp-content
|  |  ├─ plugins
|  |  └─ themes
|  |     └─ themrish   # themrish theme directory
│  ├─ ... 
|  └─ ...
├─ .git
├─ .gitignore
└─ README.md 
```

## 必要な環境

- WordPress 5.0.3 以上
- [Local](https://local.getflywheel.com/) by Flywheel もしくはその他開発環境（PHP, MySQL）
- [composer](https://getcomposer.org/) 1.8.0 以上
- Node v14.17.5 以上

## 依存アプリケーション

- node.js version: 14.17.5 later
- npm version: 6.14.14 later
- gulp version: 4.0.2 later
- babel babel2015
- browsersync version: 2.27.5

## 使い方
### 1."[Local by Flywheel](https://local.getflywheel.com/)"によるWordPressのインストール

### 2.リポジトリクローン
``` git clone git@github.com:yat8823jp/themrishv2.git ```

### 3.クローンしたファイルの移動

``` themrish ``` ディレクトリに入っている

- .git
- .gitignore
- README.md

を ```public``` と同一階層に移動（ディレクトリ構成と同じにする）し、``` themrish ``` ディレクトリを削除

### 4.composerの実行

``` composer install ```

### 5.npm の実行

テーマ用ディレクトリに移動
``` cd public/wp-content/themes/themrish/ ```

``` npm install ```

### 6.gulpを起動して開発を開始

``` npx gulp ```

## sass

- [Dart Sass](https://www.npmjs.com/package/sass) を採用
- sass のインポートには @import ではなく @use 及び @forward を利用してください
- [gulp-sass-glob-use-forward](https://www.npmjs.com/package/gulp-sass-glob) を利用しているのでディレクトリ以下のファイルを読み込み可能
- スマホファーストを採用。mixin には tablet 600px~ と PC 1025px~ を採用

## スタイルガイド

- [Fractal ](https://www.npmjs.com/package/@frctl/fractal) を採用
- 定義ファイルは ` /src/styleguide/ ` に書いてください
- ` npx gulp styleguide ` にてビルドされます

## version

- 2.1.1 release style.css を css/main.css に変更
- 2.1.0 release Dart Sass 対応, スタイルガイド Fractal 対応
- 2.0.0 release

