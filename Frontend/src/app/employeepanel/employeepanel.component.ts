import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-employeepanel',
  templateUrl: './employeepanel.component.html',
  styleUrls: ['./employeepanel.component.scss']
})
export class EmployeepanelComponent implements OnInit {
  public employees: any[];
  public employeesToDelete: any[];
  public allChecked = false;

  public createNewEmployeeModal = false;
  constructor(public api: ApiService) {

    this.api.getEmployees().subscribe(employees => {
      this.employees = employees;
    });



   }

  ngOnInit() {
  }

  checkAll(event) {
    const checked = event.target.checked;
    this.employees.forEach(item => item.delete = checked);
  }

  markEmployee(index) {
    if (this.employees[index].delete) {
      this.employees[index].delete = false;
    } else {
      this.employees[index].delete = true;
    }
  }

  search(event) {
    const query = event.target.value;
    this.api.searchEmployees(query).subscribe(result => {
      this.employees = result;
    });
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
