import { Injectable }       from '@angular/core';
import { Http }             from '@angular/http';
import { DropdownQuestion } from './question-dropdown';
import { QuestionBase }     from './question-base';
import { TextboxQuestion }  from './question-textbox';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class QuestionService {
  // Todo: get from a remote source of question metadata
  // Todo: make asynchronous
  data: {} = {};
  structure: QuestionBase<any>[] = [];

  constructor(private http: Http) {
  }

    getQuestions() {
        let questions: QuestionBase<any>[] = [
            new DropdownQuestion({
                key: 'brave',
                label: 'Bravery Rating',
                options: [
                    {key: 'solid',  value: 'Solid'},
                    {key: 'great',  value: 'Great'},
                    {key: 'good',   value: 'Good'},
                    {key: 'unproven', value: 'Unproven'}
                ],
                order: 3
            }),
            new TextboxQuestion({
                key: 'firstName',
                label: 'First name',
                value: 'Bombasto',
                required: true,
                order: 1
            }),
            new TextboxQuestion({
                key: 'emailAddress',
                label: 'Email',
                type: 'email',
                order: 4
            }),
            new TextboxQuestion({
                key: 'ageField',
                label: 'Age',
                type: 'number',
                order: 2
            })
        ];
        return questions.sort((a, b) => a.order - b.order);
    }

    // initialize form object from json loaded in loadJson function
    defineFormStructure(data: {}): QuestionBase<any>[] {
        let tmp;
        // check if element have any childs
        if (data['children']) {
            // call defineFormStructure on them (recursively)
            for (let kid of data['children']) {
                this.defineFormStructure(kid);
            }
        } else {
            // input data represents TextboxQuestion
            if (data['inputs']) {
                // iterate over all objects in list
                for (let a of data['inputs']) {
                    // if object is CODED_TEXT and object has propery list - Dropdown
                    if (a['type'] === 'CODED_TEXT' && a['list']) {
                        tmp = new DropdownQuestion({
                            key: data['name'].toLowerCase().replace(' ', '_') + '.' + a['suffix'],
                            label: `${data['localizedName']} (${a['suffix']})`,
                            // label: a['suffix'] !== 'unit' ? `${data['localizedName']} (${a['suffix']})` : '',
                            options: a['list'].map((obj: {}) => { return {key: obj['value'], value: obj['label']}; }),
                            onlySon: data['inputs'].length === 1
                        });
                    } else if (a['type'] === 'DECIMAL') { // if object is DECIMAL - Textbox
                        tmp = new TextboxQuestion({
                            key: data['name'].toLowerCase() + '.' + a['suffix'],
                            label: data['localizedName'],
                            type: 'number',
                            onlySon: data['inputs'].length === 1,
                            validation: a['validation']
                        });
                    }
                    this.structure.push(tmp);
                } // end of for
            }
        }
        return this.structure;
    }

    // get data from json, which defines form structure
    loadJson() {
        return this.http.get('./form.json').toPromise();
    }


}
