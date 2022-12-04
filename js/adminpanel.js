import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getDatabase, ref, set, onValue, get, child, push } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyBhxVWhbbjrM7eygmj92X7HpEdCZsrc1Sk",
    authDomain: "bookstore-6ffb9.firebaseapp.com",
    projectId: "bookstore-6ffb9",
    storageBucket: "bookstore-6ffb9.appspot.com",
    messagingSenderId: "707736113670",
    appId: "1:707736113670:web:db43e6ec937d417a432987"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


$(document).ready(function () {



    // admin panel search from api event

    $(".searchbtn").on("click", function () {
        event.preventDefault()
        var search = $(".searchinput").val().trim();
        var bookname = $("#bookname");
        var authorname = $("#authorname");
        var description = $("#description");
        var booktype = $("#booktype");
        var imgurl = $("#imgurl");


        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes?q=${search}`,
            method: 'GET'
        }).then(function (result) {
            $(bookname).val(result.items[0].volumeInfo.title);
            $(authorname).val(result.items[0].volumeInfo.authors[0]);
            $(description).val(result.items[0].volumeInfo.description);
            $(booktype).val(result.items[0].volumeInfo.categories[0]);
            $(imgurl).val(result.items[0].volumeInfo.imageLinks.smallThumbnail);


        })


        $(".searchinput").val("");

    })

})



// book  info  add event
$(".bookformbtn").on("click", function () {
    event.preventDefault();
    var bookname = $("#bookname").val().trim();
    var authorname = $("#authorname").val().trim();
    var describtion = $("#description").val().trim();
    var booktype = $("#booktype").val().trim();
    var imgurl = $("#imgurl").val().trim();
    var r = ref(db, `/Books/${bookname}`);
    set(r, {

        'authorname': authorname,
        'describtion': describtion,
        'booktype': booktype,
        'imgurl': imgurl

    })
    var r = ref(db, `/categories/${booktype}/${bookname}`);
    set(r, {

        'authorname': authorname,
        'describtion': describtion,
        'imgurl': imgurl

    })

    $("#bookname").val("");
    $("#authorname").val("");
    $("#description").val("");
    $("#booktype").val("");
    $("#imgurl").val("");

})
// about info add event
$(".aboutinfoadd").on("click", function () {
    event.preventDefault();
    var title = $("#abouttitle").val().trim();
    var imgurl = $("#aboutimgurl").val().trim();
    var describtion = $("#aboutdescribtion").val().trim();

    var r = ref(db, `/About`);
    set(r,
        {
            'book': title,
            'describtion': describtion,
            'imgurl': imgurl
        })


    $("#abouttitle").val("");
    $("#aboutimgurl").val("");
    $("#aboutdescribtion").val("");
})

// contactus info add event
$(".sendbtn").on("click", function () {
    event.preventDefault();
    var name = $("#contactnameinput").val().trim();
    var mail = $("#contactmailinput").val().trim();
    var adress = $("#contactadressinput").val().trim();
    var phone = $("#contactphoneinput").val().trim();


    var r = ref(db, `/Contactus/${name}`);
    set(r,
        {
            'mail': mail,
            'adress': adress,
            'phone': phone
        })
    $("#contactnameinput").val("");
    $("#contactmailinput").val("");
    $("#contactadressinput").val("");
    $("#contactphoneinput").val("");
})


// joinsus info add event
$("#modaljoinbtn").on("click", function () {
    event.preventDefault();
    var name = $("#modalnameinput").val().trim();
    var mail = $("#modalmailinput").val().trim();


    var r = ref(db, `/joinus/${name}`);
    set(r,
        {
            'mail': mail,
        })
    $("#modalnameinput").val("");
    $("#modalmailinput").val("");

})

// about onvalue
onValue(ref(db, "/About"), snapshot => {
    $("#abouttitle").html(snapshot.val().book);
    $("#abouttext").html(snapshot.val().describtion);
    $("#about-img").attr("src", snapshot.val().imgurl);

})


// contactus onvalue
onValue(ref(db, "/Contactus"), snapshot => {
    var a = snapshot.val();
    var array = Object.keys(a);
    for (let i in array) {
        var table = $(".contactustable");
        var tr = $("<tr>");
        table.append(tr);
        var index = $("<td>").html(i);
        var name = $("<td>").html(array[i]);
        var adress = $("<td>").html(snapshot.val()[array[i]].adress);
        var mail = $("<td>").html(snapshot.val()[array[i]].mail);
        var phone = $("<td>").html(snapshot.val()[array[i]].phone);

        tr.append(index, name, adress, mail, phone)
    }
})



// joinus onvalue
onValue(ref(db, "/joinus"), snapshot => {
    var a = snapshot.val();
    var array = Object.keys(a)
    for (let i in array) {
        var table = $(".joinustable");
        var tr = $("<tr>");
        table.append(tr);
        var index = $("<td>").html(i);
        var name = $("<td>").html(array[i]);
        var mail = $("<td>").html(snapshot.val()[array[i]].mail);

        tr.append(index, name, mail)


    }


})



// search dropdown

$(".searchinput").keyup(function () {
    if ($(".searchinput").val() !== "") {
        $("#results").empty()
        var element = $(".searchinput").val()
        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes?q=${element}`
        }).then(result => {
            for (let i = 0; i < 5; i++) {
                var option = $(`<option id='option'>`);
                $(option).attr("value", result.items[i].volumeInfo.title)
                $("#results").append(option)
            }

        })
    }
})




// local storage set data 

onValue(ref(db, "/Books"), snapshot => {
    //     $(".daybesdi").empty()
    var a = snapshot.val();
    var books = Object.keys(a);

    localStorage.setItem("books", JSON.stringify(snapshot.val()));
    localStorage.setItem("booksarray", JSON.stringify(books));





})

onValue(ref(db, "/categories"), snapshot => {

    var a = snapshot.val();

    var array = Object.keys(a)


    for (let i in array) {
        localStorage.setItem(`${array[i]}`, JSON.stringify(a[array[i]]));
        localStorage.setItem(`${array[i]}array`, JSON.stringify(Object.keys(a[array[i]])));
    }

})



// category slide adder

function categorySlideAdder(x) {

    var a = JSON.parse(localStorage.getItem(`${x}`));
    var b = JSON.parse(localStorage.getItem(`${x}array`));
    console.log(a);
    console.log(b);

    for (let i in b) {
        $(`.card${i}`).empty()
        var card = $("<div class='book_box'>");
        var img = $("<img class='img-book'>");
        var h5 = $("<h5 class='card-title'>");
        var p = $("<p class='book-name'>");
        var button = $("<button class='read-btn'>");
        $(button).attr("value", `${b[i]}`);
        $(img).attr("src", a[b[i]].imgurl);
        $(h5).html(b[i]);
        $(p).html(a[b[i]].authorname)

        $(button).html("READ MORE")
        $(card).append(img, h5, p, button);
        if (x === "New") {
            var newdiv = $("<div class='new'>");
            $(newdiv).html("NEW");
            $(card).append(newdiv);
        }


        $(`.card${i}`).append(card);



    }

}

// all books slide adder
function slideAdder() {
    var a = JSON.parse(localStorage.getItem('books'));
    var b = JSON.parse(localStorage.getItem('booksarray'));

    for (let i in b) {
        var card = $("<div class='book_box'>");
        var img = $("<img class='img-book'>");
        var h5 = $("<h5 class='card-title'>");
        var p = $("<p class='book-name'>");
        var button = $("<button class='read-btn'>");
        $(button).attr("value", `${b[i]}`);
        $(img).attr("src", a[b[i]].imgurl);
        $(h5).html(b[i]);
        $(p).html(a[b[i]].authorname)

        $(button).html("READ MORE")
        $(card).append(img, h5, p, button);



        $(`.card${i}`).append(card);



    }

}

slideAdder()


// bestseller carousel js

onValue(ref(db, "/categories/Bestseller"), snapshot => {

    var a = snapshot.val()
    var b = Object.keys(a)


    for (let i in b) {
        var card = $("<div class='book_box'>");
        var img = $("<img class='img-book'>");
        var h5 = $("<h5 class='card-title'>");
        var p = $("<p class='book-name'>");
        var button = $("<button class='read-btn'>");
        $(button).attr("value", `${b[i]}`);
        $(img).attr("src", a[b[i]].imgurl);
        $(h5).html(b[i]);
        $(p).html(a[b[i]].authorname)

        $(button).html("READ MORE")
        $(card).append(img, h5, p, button);



        $(`.best${i}`).append(card);

        // $(".daybesdi").insertBefore(item, $(".daybesdi").childNodes[0]);

    }



})






// onvalue for new releases

onValue(ref(db, "/categories/New"), snapshot => {

    var a = snapshot.val()
    var b = Object.keys(a)


    for (let i in b) {
        var card = $("<div class='book_box'>");
        var img = $("<img class='img-book'>");
        var h5 = $("<h5 class='card-title'>");
        var p = $("<p class='book-name'>");
        var button = $("<button class='read-btn'>");
        var newdiv = $("<div class='new'>");
        $(newdiv).html("NEW")
        $(button).attr("value", `${b[i]}`);
        $(button).attr("onclick", `readMore()`);
        $(img).attr("src", a[b[i]].imgurl);
        $(h5).html(b[i]);
        $(p).html(a[b[i]].authorname);

        $(button).html("READ MORE")
        $(card).append(img, h5, p, button, newdiv);



        $(`.new${i}`).append(card);

        // $(".daybesdi").insertBefore(item, $(".daybesdi").childNodes[0]);

    }



})


// onvalue for categories list
onValue(ref(db, "/categories"), snapshot => {

    var a = snapshot.val()
    var b = Object.keys(a)


    for (let i in b) {
        var button = $("<button class='catalog-btn'>");
        $(button).attr("id", "catbtn");
        $(button).attr("value", `${b[i]}`);
        $(button).html(b[i]);
        $(".scrollcategories").append(button)

        var indexbtn = $("<button class='catalogbtn'>")
        $(indexbtn).attr("value", `${b[i]}`)
        $(indexbtn).html(b[i])
        var indexbtndiv = $("<div class='col-lg-4 col-md-12  btndiv'>")
        $(indexbtndiv).append(indexbtn)
        $(".buttons").append(indexbtndiv)
    }



})


// read-more btn event

$(document).on("click", ".read-btn", function () {
    console.log("salam")
    var book = $(".read-btn").attr("value")
    var a = JSON.parse(localStorage.getItem("books"));
    
    var title = $("<div class='h2'>");
    var addedday = $("<div class='h3'>");
    var author = $("<div class='h5'>");
    var description = $("<p class='text_p'>");
    $(title).html(book)
    $(addedday).html("1 days ago added");
    $(author).html(a[book]['authorname']);
    $(description).html(a[book]["describtion"]);
     
    $(".bookaboutcard").append(title,addedday,author,description)
    
    // window.location.replace(".//book-page.html")

})

// catbtn event

$(document).on("click", "#catbtn", function () {
    event.preventDefault();
    console.log($(this).attr("value"))
    categorySlideAdder($(this).attr("value"))


})

// indexbtn click event

$(document).on("click", ".btndiv", function () {

    categorySlideAdder($(this).attr("value"))

    window.location.replace(".//catalog.html")

})






// search page js codes

function searchSlideAdder(b) {
    var a = JSON.parse(localStorage.getItem('books'));
    // var b = JSON.parse(localStorage.getItem('booksarray'));

    for (let i in b) {
        var li = $("<li class='c'>");
        var firstdiv = $('<div class="imgg">');
        var img = $("<img >");
        $(img).attr("id", "slider-img");
        $(firstdiv).append(img);

        var seconddiv = $("<div class='content'>");
        var bookname = $("<div class='bookname'>");
        var authorname = $("<div class='authorname'>");
        var p = $("<p class='aboutbook'>");
        $(seconddiv).append(bookname, authorname, p);




        $(img).attr("src", a[b[i]].imgurl);
        $(bookname).html(a[b[i]]);
        $(authorname).html(a[b[i]].authorname)
        $(p).html(a[b[i]].describtion)

        $(li).append(firstdiv, seconddiv)
        $("#ul").append(li)
    }

}



$("#searchpagebtn").on("click", function () {

    $(".searchresultcontent").removeClass("d-none")

    var a = JSON.parse(localStorage.getItem('books'));
    var b = JSON.parse(localStorage.getItem('booksarray'));

    var results = [];

    var a = $("#searchpageinput").val().trim()

    for (let i of b) {
        if ((i.toLowerCase()).includes(a.toLowerCase())) {
            results.push(i)
        }
    }
    searchSlideAdder(results)
    console.log(results)

})

