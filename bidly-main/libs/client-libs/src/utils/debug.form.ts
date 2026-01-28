import { FormGroup } from '@angular/forms';

/**
 * @name fnDebugForm
 * @param {FormGroup} form
 * @returns {boolean}
 */
export function fnDebugForm(form: FormGroup): boolean {
  form.valueChanges.subscribe(() => {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control?.invalid) {
        console.debug(`❌ [${key}] : `, control.errors);
      }
    });
  });

  return form.valid;
}
