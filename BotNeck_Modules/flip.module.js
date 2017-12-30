var flip = function() {};

flip.char_list = "abcdefghijklmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWYZ12345679!&*(),.'";
flip.alt_char_list = "ɐqɔpǝɟƃɥᴉɾʞlɯudbɹʇnʌʍxʎz∀qƆpƎℲפHIſʞ˥WNԀQɹ┴∩ΛM⅄ZƖᄅƐㄣϛ9ㄥ6¡⅋*)('˙,";

flip.prototype.command = "flip";
flip.prototype.minArgs = 1;
flip.prototype.help = "Flip the text! Usage: flip <text>"

flip.prototype.execute = function(msg, args)
{
	let flip_chars = {};
	let txt = args.join(" ");

	for(var i = 0; i < flip.char_list.length; i++)
		flip_chars[flip.char_list[i]] = flip.alt_char_list[i];
	for(var i = 0; i < txt.length; i++)
		if(flip_chars.hasOwnProperty(txt[i]))
			txt = txt.substring(0, i) + flip_chars[txt[i]] + txt.substring(i + 1);

	msg.content = txt;
}
