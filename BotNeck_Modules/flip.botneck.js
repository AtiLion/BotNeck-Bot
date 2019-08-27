class flip {
	constructor() {
		this.permissions = [];
		this.command = "flip";
		this.description = "Flip the text";
		this.usage = "flip [text]";

		this.char_list = "abcdefghijklmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWYZ12345679!&*(),.'";
		this.alt_char_list = "ɐqɔpǝɟƃɥᴉɾʞlɯudbɹʇnʌʍxʎz∀qƆpƎℲפHIſʞ˥WNԀQɹ┴∩ΛM⅄ZƖᄅƐㄣϛ9ㄥ6¡⅋*)('˙,";
	}

	execute(message, args) {
		// Get input
		let input = "";
		for(let i in args)
			input += args[i] + " ";

		// Empty content
		message.content = "";

		// Flip
		for(let i = 0; i < input.length; i++) {
			let index = this.char_list.indexOf(input[i]);

			if(index < 0)
				message.content += input[i];
			else
				message.content += this.alt_char_list[index];
		}
	}
}
