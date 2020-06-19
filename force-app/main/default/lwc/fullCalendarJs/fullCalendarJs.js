import { LightningElement, wire, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import fetchOpportunity from '@salesforce/apex/OpportunityController.getOpportunities';

export default class FullCalendarJs extends LightningElement {
  fullCalendarJsInitialised = false;
  @track oppEvents = [];

  renderedCallback() {
    if (this.fullCalendarJsInitialised) {
      return;
    }
    this.fullCalendarJsInitialised = true;

    Promise.all([
      loadScript(this, FullCalendarJS + '/jquery.min.js'),
      loadScript(this, FullCalendarJS + '/moment.min.js'),
      loadScript(this, FullCalendarJS + '/fullcalendar.min.js'),
      loadStyle(this, FullCalendarJS + '/fullcalendar.min.css'),
    ])
    .then(() => {
      this.initialiseFullCalendarJs();
    })
    .catch(error => {
      console.error({
        message: 'Error occured on FullCalendarJS',
        error
      });
    })
  }

  @wire(fetchOpportunity)
  getOpportunities({ error, data }) {
    if (data) {      
      for (var i = 0; i < data.length; i++) {
          if (data[i].CloseDate)
            this.oppEvents.push({
              id: data[i].Id,
              title: data[i].Name,
              start: data[i].CloseDate      
            })
      }
      console.log('getOpportunities' + JSON.stringify( this.oppEvents));
    }  
  }
  
  initialiseFullCalendarJs() {
    
    console.log('initialiseFullCalendarJs = ' + JSON.stringify( this.oppEvents));
    const ele = this.template.querySelector('div.fullcalendarjs');
    $(ele).fullCalendar({
      header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,basicWeek,basicDay'
      },
      defaultDate: new Date(),
      // defaultDate: new Date(), // default day is today
      navLinks: true, 
      editable: true,
      eventLimit: true, 
      events: this.oppEvents
      /*events: [
        {
            title: 'All Day Event',
            start: '2019-01-01'
        },
        {
            title: 'Long Event',
            start: '2019-01-07',
            end: '2019-01-10'
        },
        {
            id: 999,
            title: 'Repeating Event',
            start: '2019-01-09T16:00:00'
        },
        {
            id: 999,
            title: 'Repeating Event',
            start: '2019-01-16T16:00:00'
        },
        {
            title: 'Conference',
            start: '2019-01-11',
            end: '2019-01-13'
        },
        {
            title: 'Meeting',
            start: '2019-01-12T10:30:00',
            end: '2019-01-12T12:30:00'
        },
        {
            title: 'Lunch',
            start: '2019-01-12T12:00:00'
        },
        {
            title: 'Meeting',
            start: '2019-01-12T14:30:00'
        },
        {
            title: 'Happy Hour',
            start: '2019-01-12T17:30:00'
        },
        {
            title: 'Dinner',
            start: '2019-01-12T20:00:00'
        },
        {
            title: 'Birthday Party',
            start: '2019-01-13T07:00:00'
        },
        {
            title: 'Click for Google',
            url: 'http://google.com/',
            start: '2019-01-28'
        }
      ]*/
    });
  }
}