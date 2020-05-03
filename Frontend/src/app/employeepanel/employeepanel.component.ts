import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-employeepanel',
  templateUrl: './employeepanel.component.html',
  styleUrls: ['./employeepanel.component.scss']
})
export class EmployeepanelComponent implements OnInit {
  public employees: any[];

  public createNewEmployeeModal = false;
  constructor(public api: ApiService) {

    this.api.getEmployees().subscribe(employees => {
      this.employees = employees;
    });



   }

  ngOnInit() {
  }


  createNew(form) {

    form.account_level = 'Employee';
    form.phoneNumbers = [form.phone_number + ''];
    delete form.phone_number;


    this.api.register(form).subscribe(result => {
        location.reload();
    });
  }

}
