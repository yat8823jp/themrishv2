# themrish v2

for WordPress theme develop auxiliary tool

WordPressのテーマ開発補助ツールです。

ブラウザシンクによるソースファイル保存時のページリロード
sassコンパイラ
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
- Node v10.15.0 以上

## 依存アプリケーション

- node.js version: 10.15.0 later
- npm version: 6.7.0 later
- gulp version: 4.0.0 later
- babel babel2015
- browsersync version: 2.26.3

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

## version

- 2.0.0 release

