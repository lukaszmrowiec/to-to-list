import { Component, ViewChild, OnInit } from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSort } from "@angular/material";
import { MatSortModule } from "@angular/material/sort";
import { ToDoListService } from "./to-do-list.service";

@Component({
  selector: "app-to-do-list",
  templateUrl: "./to-do-list.component.html",
  styleUrls: ["./to-do-list.component.css"],
  providers: [ToDoListService]
})
export class ToDoListComponent implements OnInit {
  toDoListArray: any[];
  displayedColumns = ["id","name", "date", "hour","priority","delete"];
  dataSource;
  taskId: number = 0;
  // selected = 'Normal';
  importanceLlevel: string = 'Normal';

  constructor(private todoListService: ToDoListService) {}

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.todoListService
      .getToDoList()
      .snapshotChanges()
      .subscribe(item => {
        this.toDoListArray = [];
        item.forEach(element => {
          const x = element.payload.toJSON();
          x["$key"] = element.key;
          this.toDoListArray.push(x);
        });
        this.getFireData();
      });
  }

  getFireData() {
    this.dataSource = new MatTableDataSource(this.toDoListArray);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    return this.dataSource;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  addTask(task) {
    this.taskId++;
    this.todoListService.addTask(task.value, this.taskId, this.importanceLlevel);
    task.value = null;
    this.dataSource.paginator = this.paginator;
  }

  // setimportanceLlevel(option) {
  //   this.importanceLlevel = option;
  // }

  priorityUdate ($key: string, option: string) {
    console.log(option);
    this.todoListService.updateItem($key, {priority: option});
  }

  deletingTask($key: string) {
    this.todoListService.removeTask($key);
  }
}

export interface Task {
  name: string;
}

let tasks: Task[] = [{ name: "zad1" }];
