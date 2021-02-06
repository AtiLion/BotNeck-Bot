const { DiscordEmbed } = require('./DiscordAPI');

/**
 * Converts an embed into message content
 * @param {DiscordEmbed} embed The embed used for converting
 * @returns {String} The message content string from embed
 */
function embedToContent(embed) {
    let output = '';

    if(embed.embed.title) output += '**' + embed.Title + '**\n'; // Add title
    if(embed.embed.url) output += embed.Url + '\n'; // Add url
    if(embed.embed.title || embed.embed.url) output += '\n'; // New line spacing

    if(embed.embed.description) output += '```\n' + embed.Description + '```\n'; // Add description
    if(embed.Fields.length > 0) output += '```\n';
    for(let field of embed.Fields) {
        output += field.Name + '\n'; // Add field name
        output += '\t' + field.Value + '\n'; // Add field value
    }
    if(embed.Fields.length > 0) output += '```\n\n';
    if(embed.embed.footer) output += embed.Footer.Text + '\n'; // Add footer
    
    if(embed.embed.timestamp) output += '*' + embed.Timestamp.toDateString() + '*'; // Add timestamp
    if(embed.embed.timestamp && embed.embed.author) output += '* | *'; // Add seperator
    if(embed.embed.author) output += '*' + embed.Author.Name + '* (' + embed.Author.Url + ')'; // Add author

    return output;
}

module.exports = {
    embedToContent
}