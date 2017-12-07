import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'trm-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.css'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AddressInputComponent), multi: true}
  ]
})
export class AddressInputComponent implements OnInit, ControlValueAccessor {
  form: FormGroup;
  propagateChange = (val: any) => {};
  propagateOnTouched = (val: any) => {};

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      'street': '',
      'zip': '',
      'city': '',
      'country': ''
    });
    this.form.valueChanges.subscribe(address => this.propagateChange(address));
  }

  writeValue(address: any): void {
    this.form.setValue(address);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateOnTouched = fn;
  }
}
