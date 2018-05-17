import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, Slides } from 'ionic-angular';

class Photo {
  url: string;

  constructor(url: string) {
    this.url = url;
  }
}


class Article {
  artTitle: string;
  artText: string;
  isEdit: boolean;

  constructor(artTitle: string, artText: string){
    this.artTitle = artTitle;
    this.artText = artText;
    this.isEdit = false;
  }
}

@IonicPage({
  name: 'about',
  segment: 'about'
})


@Component({
selector: 'about-component',
templateUrl: 'about.component.html'
})
export class AboutComponent {

  @ViewChild(Slides) slides: Slides;
  photosArr : string [] = ['https://photos-kr.kcdn.kz/content/30/5629549cfa9dd4394-917450300-2014industrialnyy-impuls.jpg',
    'http://mebel-astra.com/sklad-5.jpg',
    'http://tehnopark-m4.ru/__scale/uploads/s/v/5/r/v5rpwqjnpaxp/img/full_1FN4snhP.jpg?width=720&quality=92',
    'http://abmcloud.com/wp-content/uploads/otraslevaya-sistema-ucheta-zapasnyh-chastej-na-sklade-840x468.jpg',
    'http://abc-byvanie.sk/media/images/1418804537-jemebe-original.jpg',
    'http://www.m-apteka.com/upload/iblock/15b/15baf0bfed8dd7dd7746a015088081a7.jpg',
    'https://besplatka.ua/aws/22/50/08/38/rabotniki-na-sklad-odezhdy-v-polshu-photo-97f3.jpg'
  ];

  constructor(public navCtrl: NavController) {
    if(localStorage.getItem('nowUser') != null) {
      if (localStorage.getItem('nowUser').length === 0) this.itemTapped();
    }
    this.parseItemsArticles();
    this.parseItemsPhoto();
    this.slidesCounter();
  }

  articles: Article[] = [];
  newArticle: boolean = false;
  newTitleText : string;
  newArticleText : string;
  isNewPhoto : boolean;
  photoURL : string;
  slidesCountArr : number[] = [];

  deletePhoto(i) {

    if (this.slidesCountArr.length > 1 && (this.photosArr.length  % 4) === 1 && i === this.photosArr.length - 1) {
      this.slides.slidePrev();
    }
    let oldItems = JSON.parse(localStorage.getItem('photosArray')) || [];

    oldItems.splice(i,1);

    localStorage.setItem('photosArray', JSON.stringify(oldItems));

    this.parseItemsPhoto();

    this.slidesCounter();
  }



  division(a,b) {
    return (a - a % b) / b;
  };

  slidesCounter() {
    console.log(this.photosArr.length)
    if(this.photosArr.length == 0) {
      this.slidesCountArr.length = 0;
      return;
    }
    if(this.photosArr.length == 1 || this.photosArr.length == 2 || this.photosArr.length == 3 || this.photosArr.length == 4) {
      this.slidesCountArr.length = 1;
      this.slidesCountArr[0] = 0;
      return;
    }

    let slideLeft = (this.photosArr.length  % 4) > 0;
    let slidesCount = this.division(this.photosArr.length, 4);
    if (slideLeft && slidesCount > 0) {
      slidesCount++;
    }
    console.log(slidesCount)
    this.slidesCountArr.length = 0;

    for(let i = 0; i < slidesCount; i++)
      this.slidesCountArr[i] = i;
  }

  addNewPhoto(photoURL) {
    if (this.isNewPhoto && (/^(ftp|http|https):\/\/[^ "]+$/.test(photoURL) || /((\w{1}:\\(([A-z]|[0-9]|\s)+)\\\w+\.\w+))|(\w{1}:\\(\w+\.\w+))/.test(photoURL))) {
      this.addToLocalStoragePhoto(photoURL);
      this.photoURL = '';
      this.isNewPhoto = !this.isNewPhoto;
    }
    this.slidesCounter();
  }

  parseItemsPhoto() {
    this.photosArr = JSON.parse(localStorage.getItem('photosArray')) || [];

  }

  addToLocalStoragePhoto(url) {
    let oldItems = JSON.parse(localStorage.getItem('photosArray')) || [];

    let newMyItem = new Photo(url);

    oldItems.unshift(newMyItem);

    localStorage.setItem('photosArray', JSON.stringify(oldItems));

    this.parseItemsPhoto();
  }


  parseItemsArticles() {
    this.articles = JSON.parse(localStorage.getItem('articlesArray')) || [];
  }

  addToLocalStorageArticles(titleText, articleText) {
    let oldItems = JSON.parse(localStorage.getItem('articlesArray')) || [];

    let newMyItem = new Article(titleText, articleText);

    oldItems.unshift(newMyItem);

    localStorage.setItem('articlesArray', JSON.stringify(oldItems));

    this.parseItemsArticles();
  }

  editThisArticle(titleText, articleText, i) {

    let oldItems = JSON.parse(localStorage.getItem('articlesArray')) || [];

    oldItems[i].artTitle = titleText;
    oldItems[i].artText = articleText;
    oldItems[i].isEdit = !this.articles[i].isEdit;

    localStorage.setItem('articlesArray', JSON.stringify(oldItems));

    this.parseItemsArticles();
  }

  checkingEditing() {
    for (let i = 0; i < this.articles.length; i++)
      if (this.articles[i].isEdit == true)
        return true;
  }

  editingArticleOpen(article) {
    for (let i = 0; i < this.articles.length; i++)
      if (this.articles[i].isEdit == true)
        return;
    article.isEdit = !article.isEdit;
  }

  prevSld() {
    this.slides.slidePrev();
  }

  nextSld() {
    this.slides.slideNext();
  }

  createFormForNewArticle() {
    this.newArticle = !this.newArticle;
  }

  checkingText(text) {
    let b = document.querySelector("#editArt");

    if (text.length == 0) {
      b.setAttribute("disabled", "disabled");
    } else {
      b.removeAttribute("disabled")
    }
  }

  deleteArticle(i) {
    let oldItems = JSON.parse(localStorage.getItem('articlesArray')) || [];

    oldItems.splice(i,1);

    localStorage.setItem('articlesArray', JSON.stringify(oldItems));

    this.parseItemsArticles();
  }

  itemContact() {
    this.navCtrl.push('contact');
  }

  itemTapped() {
    localStorage.setItem('nowUser', '');
    this.navCtrl.push('login');
  }

  itemMain() {
    this.navCtrl.push('main');
  }

  addNewArticle(newTitleText, newArticleText) {
    if(newArticleText == undefined || newTitleText == undefined || newTitleText.length== 0 || newArticleText.length == 0) {
      this.newTitleText = '';
      this.newArticleText = '';
      return;
    }
    //this.articles.unshift(new Article(newTitleText, newArticleText));
    this.addToLocalStorageArticles(newTitleText, newArticleText);
    this.parseItemsArticles();
    this.newTitleText = '';
    this.newArticleText = '';
  }

  // nextImg() {
  //   console.log(this.photoIndex)
  //   if (this.photoIndex == this.photosArr.length - 1) {
  //     this.photoIndex = 0;
  //     return;
  //   }
  //   this.photoIndex++;
  // }
  // prevImg() {
  //   console.log(this.photoIndex)
  //   if (this.photoIndex == 0) {
  //     this.photoIndex = this.photosArr.length - 1;
  //     return;
  //   }
  //   this.photoIndex--;
  // }


  // openPhoto(src) {
  //   for(let i = 0; i < this.photosArr.length; i++)
  //     if (this.photosArr[i] == src) {
  //       this.photo = src;
  //       this.photoIndex = i;
  //     }
  //   this.openGallery();
  //
  // }
  // openGallery() {
  //   this.gallery = !this.gallery;
  // }

}
