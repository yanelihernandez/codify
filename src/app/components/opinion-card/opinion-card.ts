import { Component, Input } from '@angular/core';
import { Opinion } from '../../models/opinion';

@Component({
  selector: 'app-opinion-card',
  imports: [],
  templateUrl: './opinion-card.html',
  styleUrl: './opinion-card.css',
})

export class OpinionCard {
  @Input({ required: true }) opinion!: Opinion;
}
