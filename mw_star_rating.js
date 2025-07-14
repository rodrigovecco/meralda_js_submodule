class MWRatingRenderer {
  constructor(options = {}) {
    this.max = options.max || 5;
    this.iconFilled = options.iconFilled || 'glyphicon glyphicon-star';
    this.iconEmpty  = options.iconEmpty  || 'glyphicon glyphicon-star-empty';

    this.colorFilled = options.colorFilled || 'gold';
    this.colorEmpty  = options.colorEmpty  || '#ccc';
    
    this.value = options.value || 0;
    this.readonly = options.readonly || false;
    this.onChange = options.onChange || null;
    this.element = null;
  }

  setValue(value) {
    this.value = Math.max(0, Math.min(this.max, parseInt(value) || 0));
    this._render();
  }

  getValue() {
    return this.value;
  }

  setReadonly(readonly) {
    this.readonly = !!readonly;
    if (this.element) {
      if (this.readonly) {
        this.element.classList.add('readonly');
      } else {
        this.element.classList.remove('readonly');
      }
    }
  }

  setOnChange(callback) {
    this.onChange = callback;
  }

  appendTo(container) {
    this.element = document.createElement('div');
    this.element.classList.add('mw-rating-widget');
    if (this.readonly) {
      this.element.classList.add('readonly');
    }
    container.appendChild(this.element);
    this._render();
    this._attachClickHandler();
  }

  _render() {
        if (!this.element) return;
        const $el = $(this.element);
        $el.empty();

        for (let i = 1; i <= this.max; i++) {
            const isFilled = i <= this.value;
            const $star = $('<i>')
                .addClass(isFilled ? this.iconFilled : this.iconEmpty)
                .css('color', isFilled ? this.colorFilled : this.colorEmpty)
                .attr('data-value', i);
            $el.append($star);
        }
    }

  _attachClickHandler() {
    this.element.addEventListener('click', (e) => {
      if (this.readonly) return;
      if (e.target.tagName.toLowerCase() === 'i') {
        const val = parseInt(e.target.dataset.value);
        this.setValue(val);
        if (typeof this.onChange === 'function') {
          this.onChange(this.value);
        }
      }
    });
  }
}
