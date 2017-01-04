import { FormGroup } from '@angular/forms';
import { Component }       from '@angular/core';
import { QuestionService } from './question.service';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <h2>Dynamic form</h2>
      <dynamic-form *ngIf="dataIsLoaded" [questions]="questions"></dynamic-form>
    </div>
  `,
  providers:  [QuestionService]
})
export class AppComponent {
  questions: any[];
  dataIsLoaded: boolean = false;
  constructor(service: QuestionService) {
    // this.questions = service.getQuestions();

    service.loadJson().then((response) => {
      this.questions = service.defineFormStructure(response.json());
      this.dataIsLoaded = true;
    });
  }
}
