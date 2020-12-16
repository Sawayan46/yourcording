$(document).ready(function () {
	// ドロワーメニュー
	$(".drawer").drawer();
	//クリックしたら閉じる
	$(".drawer-menu li a").on("click", function () {
		$(".drawer").drawer("close");
	});

	// アコーディオン
	$(".js-faq-q").each(function () {
		$(this).on("click", function () {
			$("+.js-faq-a", this).slideToggle();
			return false;
		});
	});

	// Swiper
	var mySwiper = new Swiper(".swiper-container", {
		autoplay: {
			delay: 5000,
		},
		centeredSlides: true,
		slidesPerView: 1,
		speed: 1000,
		loop: true,

		breakpoints: {
			// 768px以上の場合
			768: {
				slidesPerView: 3.5,
				spaceBetween: 56, // 要素間のマージンはここで指定する。
			},
		},
	});

	// ## Ajaxの非同期通信で画面遷移させないようにする
	let $form = $("#js-form");
	$form.submit(function (e) {
		$.ajax({
			url: $form.attr("action"),
			data: $form.serialize(),
			type: "POST",
			dataType: "xml",
			statusCode: {
				0: function () {
					//送信に成功したときの処理
					$form.slideUp();
					$("#js-success").slideDown();
				},
				200: function () {
					//送信に失敗したときの処理
					$form.slideUp();
					$("#js-error").slideDown();
				},
			},
		});
		return false;
	});

	// formの入力確認 --すべて入力されたら送信可能にする
	let $submit = $("#js-submit");
	$("#js-form input, #js-form textarea").on("change", function () {
		if (
			$('#js-form input[type="text"]').val() !== "" &&
			$('#js-form input[type="email"]').val() !== "" &&
			$('#js-form input[name="entry.434249372"]').prop("checked") === true
		) {
			// すべて入力されたとき
			$submit.prop("disabled", false);
			$submit.addClass("-active");
		} else {
			// すべての項目が入力されていないとき
			$submit.prop("disabled", true);
			$submit.removeClass("-active");
		}
	});

	// スムーススクロール
	$('a[href^="#"]').click(function () {
		// 移動速度を指定
		let speed = 800;
		// hrefで指定されたidを取得
		let href = $(this).attr("href");
		// idの値が#またはからだった場合、htmlをターゲットにしてトップに戻る
		let target = $(href == "#" || href == "" ? "html" : href);
		// ページのトップの位置を取得
		let position = target.offset().top;
		// ターゲットの位置までspeedの速度で移動
		$("html, body").animate(
			{
				// トップからjs-headerクラスをつけたヘッダーの高さ分を引く
				scrollTop: position - $("#js-header").outerHeight(),
			},
			speed,
			"swing"
		);
		return false;
	});
});

// wow.js
new WOW().init();
