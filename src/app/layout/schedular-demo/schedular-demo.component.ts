import { CommonModule } from '@angular/common'
import { ScheduleAllModule, RecurrenceEditorAllModule, DayService } from '@syncfusion/ej2-angular-schedule'
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs'
import { DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule } from '@syncfusion/ej2-angular-calendars'
import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons'
import { ToolbarAllModule, ContextMenuAllModule, TreeViewAllModule } from '@syncfusion/ej2-angular-navigations'
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs'
import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns'



import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { hospitalData, waitingList } from './data';
import { closest, remove, addClass } from '@syncfusion/ej2-base';
import {
    EventSettingsModel, View, GroupModel, TimelineViewsService, TimelineMonthService,
    ResizeService, WorkHoursModel, DragAndDropService, ResourceDetails, ScheduleComponent, ActionEventArgs, CellClickEventArgs
} from '@syncfusion/ej2-angular-schedule';
import { DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
  imports: [CommonModule, ScheduleAllModule, RecurrenceEditorAllModule, NumericTextBoxAllModule,
    DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule, CheckBoxAllModule, ToolbarAllModule,
    DropDownListAllModule, ContextMenuAllModule, TreeViewAllModule,
    MaskedTextBoxModule, MultiSelectAllModule, ],
    providers: [ ResizeService, TimelineViewsService, TimelineMonthService,DragAndDropService,DayService],
  selector: 'app-schedular-demo',
  standalone: true,
  templateUrl: './schedular-demo.component.html',
  styleUrl: './schedular-demo.component.scss'
})
export class SchedularDemoComponent  {
  @ViewChild('scheduleObj')
  public scheduleObj?: ScheduleComponent;
  @ViewChild('treeObj')
  public treeObj?: TreeViewComponent;
  public isTreeItemDropped: boolean = false;
  public draggedItemId: string = '';
  public selectedDate: Date = new Date(2018, 7, 1);
  public currentView: View = 'TimelineDay';
  public workHours: WorkHoursModel = { start: '08:00', end: '18:00' };
  public departmentDataSource: Object[] = [
      { Text: 'GENERAL', Id: 1, Color: '#bbdc00' },
      { Text: 'DENTAL', Id: 2, Color: '#9e5fff' }
  ];
 
  public consultantDataSource: any[] = [
      { Text: 'Alice', Id: 1, GroupId: 1, Color: '#bbdc00', Designation: '5 job cards', shortName:'AA',child:null },
      { Text: 'Nancy', Id: 2, GroupId: 2, Color: '#9e5fff', Designation: '5 job cards' , shortName:'NA',child:null},
      { Text: 'Robert', Id: 3, GroupId: 1, Color: '#bbdc00', Designation: '5 job cards', shortName:'RO',child:null },
      { Text: 'Robson', Id: 4, GroupId: 2, Color: '#9e5fff', Designation: '5 job cards', shortName:'RO',child:null },
      { Text: 'Laura', Id: 5, GroupId: 1, Color: '#bbdc00', Designation: '5 job cards', shortName:'LA', child:null},
      { Text: 'Margaret', Id: 6, GroupId: 2, Color: '#9e5fff', Designation: '5 job cards', shortName:'MA', child:null}
  ];
  // public fields: Object = {
  //   dataSource: this.consultantDataSource,
  //   id: 'Id',            // Unique identifier
  //   text: 'Text',        // Display text
  //   child: null          // This is important to avoid recursion/duplication
  // };
  public group: GroupModel = { enableCompactView: false, resources: ['Departments', 'Consultants'] };
  public allowMultiple: Boolean = false;
  public eventSettings: EventSettingsModel = {
      dataSource: hospitalData,
      fields: {
          subject: { title: 'Patient Name', name: 'Name' },
          startTime: { title: 'From', name: 'StartTime' },
          endTime: { title: 'To', name: 'EndTime' },
          description: { title: 'Reason', name: 'Description' },
      }
  };

  public field: Object = { dataSource: waitingList, id: 'Id', text: 'Name' };
  public allowDragAndDrop: boolean = true;

  getConsultantName(value: ResourceDetails): string {
      return (value as ResourceDetails).resourceData[((value as ResourceDetails).resource as any).textField] as string;
  }

  getConsultantStatus(value: ResourceDetails): boolean {
      let resourceName: string =
          (value as ResourceDetails).resourceData[((value as ResourceDetails).resource as any).textField] as string;
      if (resourceName === 'GENERAL' || resourceName === 'DENTAL') {
          return false;
      } else {
          return true;
      }
  }

  getConsultantDesignation(value: ResourceDetails): string {
      let resourceName: string =
          (value as ResourceDetails).resourceData[((value as ResourceDetails).resource as any).textField] as string;
      if (resourceName === 'GENERAL' || resourceName === 'DENTAL') {
          return '';
      } else {
          return (value as ResourceDetails).resourceData['Designation'] as string;
      }
  }

  getConsultantImageName(value: ResourceDetails): string {
      return this.getConsultantName(value).toLowerCase();
  }

  onItemDrag(event: any): void {
      if (this.scheduleObj?.isAdaptive) {
          let classElement: HTMLElement = this.scheduleObj.element.querySelector('.e-device-hover') as HTMLElement;
          if (classElement) {
              classElement.classList.remove('e-device-hover');
          }
          if (event.target.classList.contains('e-work-cells')) {
              addClass([event.target], 'e-device-hover');
          }
      }
      if (document.body.style.cursor === 'not-allowed') {
          document.body.style.cursor = '';
      }
      if (event.name === 'nodeDragging') {
          let dragElementIcon: NodeListOf<HTMLElement> =
              document.querySelectorAll('.e-drag-item.treeview-external-drag .e-icon-expandable');
          for (let i: number = 0; i < dragElementIcon.length; i++) {
              dragElementIcon[i].style.display = 'none';
          }
      }
  }

  onActionBegin(event: ActionEventArgs): void {
      if (event.requestType === 'eventCreate' && this.isTreeItemDropped) {
          let treeViewdata: { [key: string]: Object }[] = this.treeObj?.fields.dataSource as { [key: string]: Object }[];
          const filteredPeople: { [key: string]: Object }[] =
              treeViewdata.filter((item: any) => item.Id !== parseInt(this.draggedItemId, 10));
          this.treeObj!.fields.dataSource = filteredPeople;
          let elements: NodeListOf<HTMLElement> = document.querySelectorAll('.e-drag-item.treeview-external-drag');
          for (let i: number = 0; i < elements.length; i++) {
              remove(elements[i]);
          }
      }
  }

  onTreeDragStop(event: DragAndDropEventArgs): void {
      let treeElement: Element = <Element>closest(event.target, '.e-treeview');
      let classElement: HTMLElement = this.scheduleObj?.element.querySelector('.e-device-hover') as HTMLElement;
      if (classElement) {
          classElement.classList.remove('e-device-hover');
      }
      if (!treeElement) {
          event.cancel = true;
          let scheduleElement: Element = <Element>closest(event.target, '.e-content-wrap');
          if (scheduleElement) {
              let treeviewData: { [key: string]: Object }[] =
                  this.treeObj?.fields.dataSource as { [key: string]: Object }[];
              if (event.target.classList.contains('e-work-cells')) {
                  const filteredData: { [key: string]: Object }[] =
                      treeviewData.filter((item: any) => item.Id === parseInt(event.draggedNodeData['id'] as string, 10));
                  let cellData: CellClickEventArgs = this.scheduleObj!.getCellDetails(event.target);
                  let resourceDetails: ResourceDetails = this.scheduleObj!.getResourcesByIndex((cellData as any).groupIndex);
                  let eventData: { [key: string]: Object } = {
                      Name: filteredData[0]['Name'],
                      StartTime: cellData.startTime,
                      EndTime: cellData.endTime,
                      IsAllDay: cellData.isAllDay,
                      Description: filteredData[0]['Description'],
                      DepartmentID: resourceDetails.resourceData['GroupId'],
                      ConsultantID: resourceDetails.resourceData['Id']
                  };
                  this.scheduleObj?.addEvent(eventData);
                  this.isTreeItemDropped = true;
                  this.draggedItemId = event.draggedNodeData['id'] as string;
              }
          }
      }
  }

}
