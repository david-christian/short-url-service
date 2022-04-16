const uri = "http://localhost:3006/service"
let isClick = true
$("#shortUrlButton").click(() => {
    if (isClick) {
        isClick = false
        const url = $("#inputUrl").val()
        reset()
        if (url.length > 1000 || url === "") {
            return alert("網址錯誤")
        }
        fetch(uri, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url
            }),
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (!data.ok) {
                alert("失敗")
                reset()
                return
            }
            if (data.ok) {
                $('.result').height(450)
                $('.result-title').text("你的縮網址為")
                $('.result-shortUrl').text(data.hashValue)
                $('.result-dedupIpCount').text(`非重複ip使用次數： ${data.dedupIpCount} 次`)
                if(!data.ogImage) data.ogImage = "https://i.imgur.com/8uTUUDY.jpg"
                $('.result-ogs').html(`
                    <div class="ogs-card">
                        <div class="ogs-imgBlock"></div>
                        <div class="ogs-title">${data.ogTitle}</div>
                    </div>
                `)
                $('.ogs-imgBlock').css({"background-image":`url(${data.ogImage})`})
            }
        })
        setTimeout(() => {
            isClick = true
        }, 3000);
    } else {
        return alert("按鈕點擊過快！")
    }
})
$('#inputUrl').click(() => {
    $('#inputUrl').val("")
})
function reset() {
    $('.result').height(1)
    $('.result-title').text("")
    $('.result-shortUrl').text("")
    $('.result-dedupIpCount').text("")
    $('.result-ogs').html("")
}