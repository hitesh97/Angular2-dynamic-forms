import { Component, Input, OnInit }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';
import { QuestionBase }              from './question-base';
import { QuestionControlService }    from './question-control.service';

import { QuestionService } from './question.service';

@Component({
  moduleId: module.id,
  selector: 'dynamic-form',
  templateUrl: 'dynamic-form.component.html',
  providers: [ QuestionControlService ]
})

export class DynamicFormComponent implements OnInit {

  @Input() questions: QuestionBase<any>[] = [];
  form: FormGroup;
  payLoad = '';
  dataIsLoaded: boolean = false;
  showGraph: boolean = false;
  type: string;
  data: {};
  options: {};
  tmpData: {} = {
    systolic: [0],
    diastolic: [0]
  };

  constructor(private qcs: QuestionControlService, private service: QuestionService) {}

  // function for initializing form - transform data to FormGroup class
  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  // function for submiting form and clearing coresponding
  onSubmit() {
    // load values from form to payLoad
    this.payLoad = this.form.value;
    // show chart container
    this.showGraph = true;
    // push new data to tmpData
    this.tmpData['systolic'].push(this.payLoad['systolic.magnitude']);
    this.tmpData['diastolic'].push(this.payLoad['diastolic.magnitude']);
    // draw chart
    this.drawGraph();
    // clear form
    this.form.reset();
  }

  // function for clearing form and hiding result containers
  clearForm() {
    // reset form
    this.form.reset();
    // hide graph
    this.showGraph = false;
    // remove/hide payLoad
    this.payLoad = undefined;
  }

  drawGraph() {
    // data and options for chart
    this.type = 'line';
    this.data = {
      // generate labels (whole numbers - lenght of data)
      labels: Array.from({length: this.tmpData['systolic'].length}, (v, k) => k + 1),
      // data with aditional colors and interpolation options
      datasets: [{
            label: 'Systolic',
            data: this.tmpData['systolic'],
            backgroundColor: [
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
            lineTension: 0
        },
        {
            label: 'Diastolic',
            data: this.tmpData['diastolic'],
            backgroundColor: [
                'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
            lineTension: 0
        }]
    };
    this.options = {
      responsive: true,
      maintainAspectRatio: true
    };
  }
}
