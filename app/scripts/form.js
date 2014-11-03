define(['jquery', 'exports', 'inputmask'], function ($, exports, inputmask) {

	'use strict';
	var Form = function (_type, frmId) {
		this.fieldDefault = {
			'nome' : 'Seu nome',
			'agencia' : 'Sua agência',
			'email' : 'Seu e-mail para contato',
			'telefone' : 'Seu telefone para contato',
			'mensagem' : 'Deixe aqui sua mensagem'
		};
		this.type = _type;
		this.isSending = false;
		this.formId = '#' + frmId;
		var image = new Image();
		image.src = window.STATIC_URL + '/send-message.gif';
	};

	Form.prototype.init = function () {
		this.addEventListeners();
		this.placeHolder();
	};

	Form.prototype.addEventListeners = function () {
		$(this.formId).submit($.proxy(this.onSubmit, this));
		$('input[name="telefone"]').inputmask('(99)9999-9999');
	};

	Form.prototype.placeHolder = function () {
		var scope = this;
		$('input[name = "nome"]').focus(function () {if ($(this).val() === scope.fieldDefault.nome) { $(this).val(''); } });
		$('input[name = "agencia"]').focus(function () {if ($(this).val() === scope.fieldDefault.agencia) { $(this).val(''); } });
		$('input[name = "email"]').focus(function () {if ($(this).val() === scope.fieldDefault.email) { $(this).val(''); } });
		$('input[name = "telefone"]').focus(function () {if ($(this).val() === scope.fieldDefault.telefone) { $(this).val(''); } });
		$('textarea[name = "mensagem"]').focus(function () {if ($(this).val() === scope.fieldDefault.mensagem) { $(this).val(''); } });

		$('input[name = "nome"]').focusout(function () {if ($(this).val() === '') { $(this).val(scope.fieldDefault.nome); } });
		$('input[name = "agencia"]').focusout(function () {if ($(this).val() === '') { $(this).val(scope.fieldDefault.agencia); } });
		$('input[name = "email"]').focusout(function () {if ($(this).val() === '') { $(this).val(scope.fieldDefault.email); } });
		$('input[name = "telefone"]').focusout(function () {if ($(this).val() === '') { $(this).val(scope.fieldDefault.telefone); } });
		$('textarea[name = "mensagem"]').focusout(function () {if ($(this).val() === '') { $(this).val(scope.fieldDefault.mensagem); } });
	};

	Form.prototype.validadeEmptyField = function (fieldName, fieldType) {
		var $field = $(this.formId + ' ' + fieldType + '[name = "' + fieldName + '"]');
		if ($field.val() === '' || $field.val() === this.fieldDefault[fieldName]) {
			return false;
		} else {
			return true;
		}
	};

	Form.prototype.validateEmail = function () {
		var email = $(this.formId  + ' input[name = "email"]').val();
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	};

	Form.prototype.onSubmit = function (e) {
		e.preventDefault();
		if (!this.validadeEmptyField('nome', 'input')) {
			this.messageFeedBack('fail', 'Preencha o campo "Nome".');
			return false;
		}

		if (!this.validadeEmptyField('email', 'input')) {
			this.messageFeedBack('fail', 'Preencha o campo "E-mail".');
			return false;
		} else {
			if (!this.validateEmail()) {
				this.messageFeedBack('fail', 'Preencha o campo "E-mail" corretamente.');
				return false;
			}
		}

		if (!this.validadeEmptyField('telefone', 'input')) {
			this.messageFeedBack('fail', 'Preencha o campo "Telefone".');
			return false;
		}

		if (!this.validadeEmptyField('mensagem', 'textarea')) {
			this.messageFeedBack('fail', 'Preencha o campo "Mensagem".');
			return false;
		}
		this.sendEmail();
	};

	Form.prototype.sendEmail = function () {
		var action = $(this.formId).attr('action');
		if (!this.isSending) {
			$(this.formId + ' .submit-form').css('background', 'url("' + window.STATIC_URL + 'send-message.gif") 0 0 no-repeat');
			this.isSending = true;
			var scope = this;
			var post = {
				subject : this.type,
				name : $(this.formId + ' input[name = "nome"]').val(),
				agency : ($(this.formId + ' input[name = "agencia"]').val() === '' || $(this.formId + ' input[name = "agencia"]').val() === 'Sua agência') ? '' : $(this.formId + ' input[name = "agencia"]').val(),
				email : $(this.formId + ' input[name = "email"]').val(),
				phone : $(this.formId + ' input[name = "telefone"]').val(),
				message : $(this.formId + ' textarea[name = "mensagem"]').val()
			};

			$.post(action, post, function (res) {
				if (res === true) {
					scope.messageFeedBack('success', 'O formulário foi enviado com sucesso!');
				} else {
					scope.messageFeedBack('fail', 'Houve um erro no envio do email, tente mais tarde.');
				}
				scope.isSending = false;
				$(scope.formId + ' .submit-form').css('background', 'url("' + window.STATIC_URL + 'sprite-site.png") -2px -80px no-repeat');
				scope.clearForm();
			}, 'json');
		}
	};


	Form.prototype.messageFeedBack = function (feedback, msg) {
		var $feedbackBox = $('.form-feedback');
		if ($feedbackBox.is(':hidden')) {
			$feedbackBox.fadeIn();
		}
		if ($feedbackBox.hasClass('fail')) {
			$feedbackBox.removeClass('fail');
			$feedbackBox.find('.alert-feed').removeClass('fail');
		}

		if ($feedbackBox.hasClass('success')) {
			$feedbackBox.removeClass('success');
			$feedbackBox.find('.alert-feed').removeClass('success');
		}

		$feedbackBox.addClass(feedback);
		$feedbackBox.find('.alert-feed').addClass(feedback);
		$feedbackBox.find('.msg-text').text(msg);
	};


	Form.prototype.clearForm = function () {
	
		$('input[name = "nome"]').val(this.fieldDefault.nome);
		$('input[name = "agencia"]').val(this.fieldDefault.agencia);
		$('input[name = "email"]').val(this.fieldDefault.email);
		$('input[name = "telefone"]').val(this.fieldDefault.telefone);
		$('textarea[name = "mensagem"]').val('');
		$('textarea[name = "mensagem"]').val(this.fieldDefault.mensagem);
		$(this.formId + ' .submit-form').css('background', 'url("static/sprite-site.png") -2px -80px no-repeat');
	};

	exports.Form = Form;
});
