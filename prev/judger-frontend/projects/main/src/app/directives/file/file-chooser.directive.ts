import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Directive({
  selector: '[swFileChooser]'
})
export class FileChooserDirective implements OnInit {

  private isDisabled: boolean;

  fileInput: HTMLInputElement;

  @Output() filesChange = new EventEmitter<File[]>();

  handleClick = () => this.fileInput.click();

  constructor(private elementRef: ElementRef) {
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
  }

  @Input() set accept(accept: string) {
    this.fileInput.accept = accept;
  }

  @Input() set multiple(multiple: boolean) {
    this.fileInput.multiple = multiple;
  }

  @Input() set disabled(disabled: boolean) {
    this.isDisabled = disabled;

    if (disabled) {
      this.elementRef.nativeElement.onclick = null;
    } else {
      this.elementRef.nativeElement.onclick = this.handleClick;
    }
  }

  ngOnInit(): void {
    this.fileInput.onchange = e => {
      const { files } = (e.target as any);
      const results = [];

      for (const file of files) {
        results.push(file);
      }

      this.filesChange.emit(results);
      this.fileInput.value = '';
    };

    if (!this.isDisabled) {
      this.elementRef.nativeElement.onclick = this.handleClick;
    }
  }
}
