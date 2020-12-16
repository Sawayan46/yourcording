// gulpプラグインの読み込み
const gulp = require("gulp");
// Sassをコンパイルするプラグインの読み込み
const sass = require("gulp-sass");
// エラー発生時のタスクの強制終了を防止するプラグイン
const plumber = require("gulp-plumber");
// エラー発生時にデスクトップに通知を表示するプラグイン
const notify = require("gulp-notify");
// @importの記述を簡潔にする
const sassGlob = require("gulp-sass-glob");
// メディアクエリの記述を一か所にまとめる
const mmq = require("gulp-merge-media-queries");
// ファイル保存時のブラウザ自動更新プラグインの読み込み
const browserSync = require("browser-sync");
// autoprefixerとセット
const postcss = require("gulp-postcss");
// ベンダープレフィクス付与のプラグインの読み込み
const autoprefixer = require("autoprefixer");
// css並べ替え
const cssdeclsort = require("css-declaration-sorter");
// 画像を縮小
const imagemin = require("gulp-imagemin");
const optipng = require("imagemin-optipng");
const mozjpeg = require("imagemin-mozjpeg");
// htmlファイルでheader,footerなどをパーツ化して呼び出す
const ejs = require("gulp-ejs");
// ファイル出力時の拡張子を変更する(gulp-ejsで出力されるファイルのリネームに使用)
const rename = require("gulp-rename");
// ソースマップの作成
const sourcemaps = require("gulp-sourcemaps");
const { task, dest } = require("gulp");

// style.cssタスクを作成する
gulp.task("sass", function () {
  return (
    gulp
      // scssフォルダ以下にある全.scssファイルを対象にする
      .src("./scss/**/*.scss")
      // gulp-sourcemapsを初期化
      .pipe(sourcemaps.init())
      // エラー発生時にタスクを止めずにエラーを表示する
      .pipe(
        plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
      )
      // @importの記述を簡潔にする
      .pipe(sassGlob())
      // コンパイル時のコードの出力の仕方
      .pipe(sass({ outputStyle: "expanded" }))
      // autoprefixerの設定
      .pipe(postcss([autoprefixer()]))
      // プロパティをソートし直す
      .pipe(postcss([cssdeclsort({ order: "smacss" })]))
      // メディアクエリを一箇所にまとめる
      .pipe(mmq({ log: true }))
      .pipe(notify("SCSSをコンパイル完了しました(｀・∀・´)"))
      // CSSフォルダに保存
      .pipe(gulp.dest("./css"))
  );
});

gulp.task("ejs", function (done) {
  gulp
    .src(["ejs/**/*.ejs", "!" + "ejs/**/_*.ejs"])
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%=error.message %>") })
    ) // エラーチェック
    .pipe(ejs())
    .pipe(rename({ extname: ".html" })) //拡張子をhtmlにする
    .pipe(gulp / dest("./"));
  done();
});

// ファイルの監視タスク
gulp.task("watch", function (done) {
  gulp.watch("./scss/**/*.scss", gulp.task("sass"));
  gulp.watch("./scss/**/*.scss", gulp.task("bs-reload"));
  gulp.watch("./js/*.js", gulp.task("bs-reload"));
  gulp.watch("./ejs/**/*.ejs", gulp.task("ejs"));
  gulp.watch("./ejs/**/*.ejs", gulp.task("bs-reload"));
  gulp.watch("./*.html", gulp.task("bs-reload"));
  done();
});

// 圧縮率の定義
const imageminOption = [
  optipng({ optimizationLevel: 5 }),
  mozjpeg({ quality: 85 }),
  imagemin.gifsicle({
    interlaced: false,
    optimizationLevel: 1,
    colors: 256,
  }),
  imagemin.mozjpeg(),
  imagemin.optipng(),
  imagemin.svgo(),
];
// 画像の圧縮
// npx gulp imageminで./src/image.base/フォルダ内の画像を圧縮し./src/img/フォルダへ
// .gifが入っているとエラーが出る
gulp.task("imagemin", function () {
  return gulp
    .src("./src/img/base/*.{png,jpg,gif,svg}")
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest("./src/img"));
});

// ファイル保存時のブラウザ自動更新
gulp.task("browser-sync", function (done) {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html",
    },
    notify: false,
  });
  done();
});

gulp.task("bs-reload", function (done) {
  browserSync.reload();
  done();
});

gulp.task("default", gulp.series(gulp.parallel("browser-sync", "watch")));
