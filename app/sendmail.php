<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);
date_default_timezone_set('America/Sao_Paulo');

require("class.phpmailer.php");
$mail = new PHPMailer();

$mail->IsSMTP();
$mail->SMTPAuth = true;
$mail->SMTPSecure = 'ssl';
$mail->Host = "smtp.gmail.com";
$mail->Port = 465;
$mail->Username = 'mail@olh.am';
$mail->Password = '$mail2012$';

$mail->From = $_POST['email'];
$mail->FromName = $_POST['nome'];
$mail->AddReplyTo($_POST['email'], $_POST['nome']);
$mail->AddAddress('blinkimagens@gmail.com', 'Blink Imagens');

$mail->IsHTML(true);
$mail->CharSet = 'utf-8';

$mail->Subject  = $_POST['subject'].' | Site - ' . $_POST['nome'];

$agenciaHTML = ( isset($_POST['agencia']) )? 'Agência: '.$_POST['agencia']. '<br />' : '';
$mail->Body = 'Nome: '.$_POST['nome'].'<br />'.$agenciaHTML.'Contato : '.$_POST['telefone'] .'<br /> <br />'. $_POST['mensagem'];
//$mail->AltBody = "";

$enviado = $mail->Send();

if ($enviado) {
	echo "success";
} else {
	echo "error";
}



?>
