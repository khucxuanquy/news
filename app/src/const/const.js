const SLASH = '-'
const FullDate = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
const _MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => 'Thg ' + i)
const ONE_MIN = 60 * 1000,
  FIFTEEN_MINUTES = 15 * ONE_MIN,
  ONE_HOUR = FIFTEEN_MINUTES * 4,
  ONE_DAY = 24 * ONE_HOUR;

export default {
    /**
    * @param {String} type 0, 1, 2
    * @param {String} date 
    * @example 0: +new Date() -> yyyy/mm/dd (1608301361443 -> '18/12/2020')
    *          1: ddmmyyy -> yyyy/mm/dd ('18122020' -> '2020/12/18')
    *          2: yyyymmdd -> dd/mm/yyyy ('20201218' -> '18122020')
    * ---------------
    */
    convertDate: function (type, date) {
        let DATE, MONTH, YEAR, HOURS, MINUTES;
        switch (type) {
            case 0: {
                let d = new Date(date)
                DATE = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
                MONTH = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
                YEAR = d.getFullYear();
                HOURS = d.getHours()
                MINUTES = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
                // return HOURS + ':' + MINUTES + '  ' + DATE + SLASH + MONTH + SLASH + YEAR // YEAR + SLASH + MONTH + SLASH + DATE;
                return DATE + SLASH + MONTH + SLASH + YEAR // YEAR + SLASH + MONTH + SLASH + DATE;
            }
            case 1: {
                DATE = date.slice(0, 2)
                MONTH = date.slice(2, 4)
                YEAR = date.slice(4, date.length)
                return YEAR + SLASH + MONTH + SLASH + DATE;
            }
            case 2: {
                YEAR = date.slice(0, 4)
                MONTH = date.slice(4, 6)
                DATE = date.slice(6, date.length)
                return DATE + MONTH + YEAR;
            }
            default: return false;
        }
    },
    dateInTopBar: function (timestamp) {
        let d = new Date(timestamp)
        let date = d.getDate(),
            month = d.getMonth() + 1,
            year = d.getFullYear(),
            day = FullDate[d.getDay()],
            hours = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds();
        // return day + ' ' + d.toLocaleString()
        return `${day}, ${date}/${month}/${year} ${hours}:${minutes}:${seconds}`
    },
    convertDateTimeline(timestamp) {
        if (!timestamp) return;
        let now = new Date(),
          time = Math.floor((+now - (Number(timestamp) || 0)) / 1000)
        // time = Math.floor((+now - (Number(timestamp) || 0)) / 1000)
    
        if (time < (ONE_MIN / 1000)) return '1 phút'
        if (time < (ONE_HOUR / 1000)) return Math.floor(time / (ONE_MIN / 1000)) + ' phút'
        if (time < (ONE_DAY / 1000)) return Math.floor(time / (ONE_HOUR / 1000)) + ' giờ'
    
        let d = new Date(timestamp),
          mins = d.getMinutes(),
          hour = d.getHours(),
          date = d.getDate(),
          month = d.getMonth(),
          year = d.getFullYear(),
          m = _MONTHS[month];
        if (time < (ONE_DAY / 1000) * 2) return 'Hôm qua, ' + hour + ':' + mins
        let showDateMonth = date + ' ' + m // 11 Thg 4
        if (time >= (ONE_DAY / 1000) * 2 && d.getFullYear() == now.getFullYear()) return showDateMonth
        else return showDateMonth + ', ' + year
      },
}