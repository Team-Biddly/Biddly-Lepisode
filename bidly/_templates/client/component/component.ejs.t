---
to: "apps/client/src/app/components/<%= kebab %>/<%= kebab %>.component.ts"
---
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-<%= kebab %>',
  templateUrl: './<%= kebab %>.component.html',
  styleUrls: './<%= kebab %>.component.scss'
})
export class <%= pascal %>Component {}