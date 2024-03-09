const moment = require('moment');
let helper = {}

helper.createGenresShort = (Genres, separator) => {
    var genres = Genres.map(genre => `<a href="/movies?genre=${genre.id}">${genre.name}</a>`);
    return genres.join(separator);
}

helper.formatDate = function (datetime, format) {
    return moment(datetime).format(format);
}

helper.ifEquals = (arg1, arg2, options) => {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
};

helper.ifContains = (arg1, arg2, options) => {
    let temp = arg1;
    return temp.includes(arg2) ? options.fn(this) : options.inverse(this);
};

helper.formatTime = (date, format) => {
    var mmnt = moment(date);
    return mmnt.format(format);
};

helper.getStatus = (status) => {
    return status == 1 ? "Positive" : "Negative";
};

helper.toUpperCase = (string) => {
    return string.toUpperCase();
};

helper.getDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.getDate();
}


helper.getMonth = (dateStr) => {
    const date = new Date(dateStr)
    return date.getMonth();
}

helper.getYear = (dateStr) => {
    const date = new Date(dateStr)
    return date.getFullYear();
}
module.exports = helper;