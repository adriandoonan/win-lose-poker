

export class SpinningCard extends HTMLElement {
    static observedAttributes = ["spin"];
  
    constructor() {
      // Always call super first in constructor
      super();
      this.spin = 0;
    }
  
    connectedCallback() {
      //console.log("Custom element added to page.");
      const body = document.querySelector('body')
      const right = body.getBoundingClientRect().right
      const bottom = body.getBoundingClientRect().bottom
      const randomValue = ['2','3','4','5','6','7','8','9','10','11','12','13','14'][Math.floor(Math.random() * 12)]
      const randomSuit = ['diamonds','spades','clubs','hearts'][Math.floor(Math.random() * 3)]
      
      this.style.backgroundImage = `url('/win-lose-poker/static/cardfronts_png_96_dpi/${randomSuit}_${randomValue}.png')`

      this.style.offsetPath = `path(\"M 0 0 C 2 8 ${Math.floor(Math.random() * (right * 0.3))} ${Math.floor(Math.random() * (bottom * 0.3))} ${Math.floor(Math.random() * (right * 0.7))} ${Math.floor(Math.random() * (bottom * 0.7))}\")`
      let spinTimer = setInterval(() => {
        if (this.spin === 360) {
          this.spin = 0
        }
        this.style.offsetRotate = `${this.spin}deg`
        this.spin += Math.floor(Math.random() * 5)
      },10)
  
      let selfDestructTimer = setTimeout(() => {
        this.remove()
      },8000)
    }
  
    disconnectedCallback() {
      //console.log("Custom element removed from page.");
    }
  
    adoptedCallback() {
      //console.log("Custom element moved to new page.");
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      //console.log(`Attribute ${name} has changed. from`,oldValue,'to',newValue);
    }
  }

export class PlayingCard extends HTMLElement {
    static observedAttributes = ['value','suit','target'];
  
    constructor(target,suit,value,hidden,origin,selfDestruct) {
      // Always call super first in constructor
      super();
      this.spin = 0;
      this.target = target || 'body';
      this.directed = false;
      this.hidden = hidden || false;
      this.suit = suit;
      this.value = value;
      this.cardImage = '';
      this.blankBackground = 'url(\'/win-lose-poker/static/blue.png\')';
      this.origin = origin;
      this.selfDestruct = selfDestruct || false;
      //this.classList.add(this.hidden ? 'hidden' : '')
    }
  
    connectedCallback() {
      //console.log("Custom element added to page.");
      console.log('this element was connected, suit was',this.suit,'and value was',this.value,'background was',this.cardImage);
      console.log('target is',this.target);
      const targetElement = document.querySelector(`${this.directed ? '#' + this.target : 'body'}`)
      console.log(targetElement);

      const right = targetElement.getBoundingClientRect().right
      const bottom = targetElement.getBoundingClientRect().bottom
      const left = targetElement.getBoundingClientRect().left
      const top = targetElement.getBoundingClientRect().top

      if (this.hidden) {
        this.classList.add('hidden')
      }
      if (this.suit && this.value) {
        this.cardImage = `url('/win-lose-poker/static/cardfronts_png_96_dpi/${this.suit}_${this.value}.png')`
        this.style.backgroundImage = this.cardImage
      }

      this.addEventListener('click',() => {
        this.style.backgroundImage = this.style.backgroundImage === this.blankBackground ? this.cardImage : this.blankBackground
      })
      this.style.offsetPath = `path(\"M 0 0 C 2 8 80 400 ${left} ${bottom}\")`
      if (this.selfDestruct) {
        this.selfDestruct = setTimeout(() => {
            this.remove()
          },8000)
      }
      let spinTimer = setInterval(() => {
        if (this.spin === 360) {
          this.spin = 0
        }
        this.style.offsetRotate = `${this.spin}deg`
        this.spin += Math.floor(Math.random() * 5)
      },10)
      setTimeout(() => {
        clearInterval(spinTimer)
        this.spin = 0;
        this.style.offsetRotate = `${this.spin}deg`
    },1000)
  

    }

  
    disconnectedCallback() {
      //console.log("Custom element removed from page.");
    }
  
    adoptedCallback() {
      //console.log("Custom element moved to new page.");
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`Attribute ${name} has changed. from`,oldValue,'to',newValue);
      if (name === 'suit') {
        this.suit = newValue
      }
      if (name === 'value') {
        this.value = newValue
      }
      if (name === 'target') {
        this.target = newValue
        console.log(document.querySelector(`#${newValue}`));
        this.directed = true
        console.log('target now', this.target);
      }
      if (this.suit && this.value) {
        this.cardImage = `url('/win-lose-poker/static/cardfronts_png_96_dpi/${this.suit}_${this.value}.png')`
        console.log('this cardimage updated to',this.cardImage);
        this.style.backgroundImage = this.cardImage
      }
    }
  }
  
  