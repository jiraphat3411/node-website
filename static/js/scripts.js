function showImage() {
    var selectBox = document.getElementById("type_sushi");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    var image = document.getElementById("selected-image");
  
    if (selectedValue === "1") {
      image.src = "https://cu.lnwfile.com/_/cu/_raw/2a/tz/ei.jpg";
      image.alt = "ภาพที่ 1";
    } else if (selectedValue === "2") {
      image.src = "https://cu.lnwfile.com/_/cu/_raw/mf/zc/gd.jpg";
      image.alt = "ภาพที่ 2";
    } else if (selectedValue === "3") {
      image.src = "https://cu.lnwfile.com/_/cu/_raw/0j/hc/n6.jpg";
      image.alt = "ภาพที่ 3";
    }
}

document.getElementById("type_sushi").onchange = showImage;

showImage();

document.getElementById("submitButton").addEventListener("click", function() {
  if (confirm("ยืนยันการส่งข้อมูล?")) {
    document.getElementById("myForm").submit();
  }
});

document.querySelector("#show").addEventListener("click",function(){
  document.querySelector(".popup").classList.add("active");
});
document.querySelector(".popup .close-btn").addEventListener("click",function(){
  document.querySelector(".popup").classList.remove("active");
});

$('.qtyplus').click(function(e){
  // หา input field ที่มี name='quantity' ใน div ที่ถูกคลิก
  var $quantityInput = $(this).closest('.details').find('input[name="quantity"]');
  // ดึงค่าปัจจุบัน
  var currentValue = parseInt($quantityInput.val());
  // เพิ่มค่า
  $quantityInput.val(currentValue + 1);
});

// ลดจำนวน
$('.qtyminus').click(function(e){
  // หา input field ที่มี name='quantity' ใน div ที่ถูกคลิก
  var $quantityInput = $(this).closest('.details').find('input[name="quantity"]');
  // ดึงค่าปัจจุบัน
  var currentValue = parseInt($quantityInput.val());
  // ตรวจสอบว่าค่าปัจจุบันมากกว่า 0 หรือไม่
  if(currentValue > 0){
      // ลดค่า
      $quantityInput.val(currentValue - 1);
  }
});

function showImage1(selectedValue) {
  var image = document.getElementById("selected-image1");
  var imagePath = "/img/" + "ot" + selectedValue + ".jpg"; // แก้ไขนามสกุลไฟล์ตามที่คุณใช้

  image.src = imagePath;
  image.alt = "ภาพที่ " + selectedValue;
}

document.getElementById("topping").onchange = function() {
  var selectBox = document.getElementById("topping");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  showImage1(selectedValue);
};

showImage1(document.getElementById("topping").value);

const languageTexts = {
  english: {
    table: "table",
    type: "type",
    chooseType: "Choose type",
    ontop: "ontop",
    allOntop: "All ontop",
    sauce: "sauce",
    chooseSauce: "Choose sauce",
    miso: "Miso",
    teriyaki: "Teriyaki",
    spicyMayo: "Spicy Mayo",
    wasabi: "Wasabi",
    shoyu: "Shoyu",
    sideDishes: "Side dishes",
    chooseSideDishes: "Choose Side dishes",
    lemon: "Lemon",
    salt: "Salt",
    misoSoup: "Miso Soup",
    submit: "Submit",
    ifYouHaveAProblem: "If you have a problem, ask the staff. sorry for the inconvenience",
    ordered: "Ordered",
  },
  thai: {
    table: "โต๊ะ",
    type: "ประเภท",
    chooseType: "เลือกประเภท",
    ontop: "หน้า",
    allOntop: "ทุกหน้า",
    sauce: "ซอส",
    chooseSauce: "เลือกซอส",
    miso: "มิโซะ",
    teriyaki: "เทอริยากิ",
    spicyMayo: "สไปซี่มาโย",
    wasabi: "วาซาบิ",
    shoyu: "โชยุ",
    sideDishes: "เครื่องเคียง",
    chooseSideDishes: "เลือกเครื่องเคียง",
    lemon: "มะนาว",
    salt: "เกลือ",
    misoSoup: "ซุปมิโชะ",
    submit: "สั่ง",
    ifYouHaveAProblem: "หากมีปัญหาให้สอบถามพนักงาน ขออภัยในความไม่สะดวก",
    ordered: "รายการที่สั่ง",
  }
};

let currentLanguage = 'english';

function changeLanguage(language) {
  currentLanguage = language;
  displayLanguageText();
}

function displayLanguageText() {
  const texts = languageTexts[currentLanguage];
  document.getElementById('table').textContent = texts.table;
  document.getElementById('type').textContent = texts.type;
  document.getElementById('chooseType').textContent = texts.chooseType;
  document.getElementById('ontop').textContent = texts.ontop;
  document.getElementById('allOntop').textContent = texts.allOntop;
  document.getElementById('sauce').textContent = texts.sauce;
  document.getElementById('chooseSauce').textContent = texts.chooseSauce;
  document.getElementById('miso').textContent = texts.miso;
  document.getElementById('teriyaki').textContent = texts.teriyaki;
  document.getElementById('spicyMayo').textContent = texts.spicyMayo;
  document.getElementById('wasabi').textContent = texts.wasabi;
  document.getElementById('shoyu').textContent = texts.shoyu;
  document.getElementById('sideDishes').textContent = texts.sideDishes;
  document.getElementById('chooseSideDishes').textContent = texts.chooseSideDishes;
  document.getElementById('lemon').textContent = texts.lemon;
  document.getElementById('salt').textContent = texts.salt;
  document.getElementById('misoSoup').textContent = texts.misoSoup;
  document.getElementById('submit').textContent = texts.submit;
  document.getElementById('ifYouHaveAProblem').textContent = texts.ifYouHaveAProblem;
  document.getElementById('ordered').textContent = texts.ordered;
}

window.onload = function() {
  displayLanguageText();

  document.getElementById('engBtn').addEventListener('click', function() {
    changeLanguage('english');
  });
  document.getElementById('thaiBtn').addEventListener('click', function() {
    changeLanguage('thai');
  });
};
