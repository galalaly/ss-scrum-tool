package controllers;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import models.Board;
import models.Column;
import models.Component;
import models.Meeting;
import models.Project;
import models.Snapshot;
import models.Sprint;
import models.Task;
import models.User;
import models.Component.ComponentRowh;

public class Snapshots extends SmartController {
	/**
	 * Takes the sprint ID and load the same things needed to load the board
	 * then start changing the dynamic variables like tasks into strings
	 * including names then save everything in a new snapshot
	 * 
	 * @author Amr Abdelwahab
	 * @param sprintID
	 */
	public static void TakeSnapshot(long sprintID) {
		Sprint s = Sprint.findById(sprintID);
		Project p = s.project;
		Board b = p.board;
		User user = Security.getConnected();
		List<Component> components = p.getComponents();

		ArrayList<ComponentRowh> data = new ArrayList<ComponentRowh>();
		List<Column> columns = b.columns;
		List<Column> CS =new ArrayList<Column>();
		ArrayList<String> Columnsofsnapshot = new ArrayList<String>();
		for( int i=0; i<columns.size();i++)
		{
			if(columns.get( i ).onBoard==true)
			{
				CS.add( columns.get( i ) );
			}
		}
		for (int i = 0; i < CS.size(); i++) {
			Columnsofsnapshot.add(null);
			Columnsofsnapshot.set(i, CS.get(i).name);
		}

		int smallest;
		Column temp;
		for (int i = 0; i < CS.size(); i++) {
			smallest = i;
			for (int j = i + 1; j < CS.size(); j++) {
				if (CS.get(smallest).sequence > CS.get(j).sequence) {
					smallest = j;

				}

			}
			temp = CS.get(smallest);
			CS.set(smallest, columns.get(i));
			CS.set(i, temp);
			Columnsofsnapshot.set(smallest, CS.get(i).name);
			Columnsofsnapshot.set(i, temp.name);
		}

		for (int i = 0; i < components.size(); i++)// for each component get
		// the tasks
		{
			data.add(null);
			data.set(i, new ComponentRowh(components.get(i).id, components.get(i).name));
			List<Task> tasks = components.get(i).returnComponentTasks(s);

			for (int j = 0; j < CS.size(); j++) {
				data.get(i).add(null);
				data.get(i).set(j, new ArrayList<String>());
			}

			for (Task task : tasks) {
				Column pcol = new Column();
				for(int k=0;k<task.taskStatus.columns.size();k++)
				{
					pcol = task.taskStatus.columns.get(k);
					if(pcol.board.id==b.id)
					{
						break;
					}
				}
				if(pcol.onBoard==true&&!pcol.deleted)
				{
				data.get(i).get(CS.indexOf(pcol)).add("(" + task.taskStory.description + ")" + "T" + task.id + "-" + task.description + "-" + task.assignee.name);
				}
			}
		}	
		String type = p.name;
		Snapshot snap = new Snapshot();
		snap.user = user;
		snap.type = type;
		snap.board = b;
		snap.sprint = s;
		snap.data = data;
		snap.Columnsofsnapshot = Columnsofsnapshot;
		snap.save();
		Calendar cal = new GregorianCalendar();
		Logs.addLog(user, "Took", "Snapshot", snap.id, p, cal.getTime());

	}

		public static void TakeSprintSnapshot(long sprintID) {
		Sprint s = Sprint.findById(sprintID);
		Project p = s.project;
		Board b = p.board;
		User user = Security.getConnected();
		List<Component> components = p.getComponents();

		ArrayList<ComponentRowh> data = new ArrayList<ComponentRowh>();
		List<Column> columns = b.columns;
		List<Column> CS =new ArrayList<Column>();
		ArrayList<String> Columnsofsnapshot = new ArrayList<String>();
		for( int i=0; i<columns.size();i++)
		{
			if(columns.get( i ).onBoard==true)
			{
				CS.add( columns.get( i ) );
			}
		}
		for (int i = 0; i < CS.size(); i++) {
			Columnsofsnapshot.add(null);
			Columnsofsnapshot.set(i, CS.get(i).name);
		}

		int smallest;
		Column temp;
		for (int i = 0; i < CS.size(); i++) {
			smallest = i;
			for (int j = i + 1; j < CS.size(); j++) {
				if (CS.get(smallest).sequence > CS.get(j).sequence) {
					smallest = j;

				}

			}
			temp = CS.get(smallest);
			CS.set(smallest, columns.get(i));
			CS.set(i, temp);
			Columnsofsnapshot.set(smallest, CS.get(i).name);
			Columnsofsnapshot.set(i, temp.name);
		}

		for (int i = 0; i < components.size(); i++)// for each component get
		// the tasks
		{
			data.add(null);
			data.set(i, new ComponentRowh(components.get(i).id, components.get(i).name));
			List<Task> tasks = components.get(i).returnComponentTasks(s);

			for (int j = 0; j < CS.size(); j++) {
				data.get(i).add(null);
				data.get(i).set(j, new ArrayList<String>());
			}

			for (Task task : tasks) {
				Column pcol = new Column();
				for(int k=0;k<task.taskStatus.columns.size();k++)
				{
					pcol = task.taskStatus.columns.get(k);
					if(pcol.board.id==b.id)
					{
						break;
					}
				}
			
				if(pcol.onBoard&&!pcol.deleted)
				{
				data.get(i).get(CS.indexOf(pcol)).add("(" + task.taskStory.description + ")" + "T" + task.id + "-" + task.description + "-" + task.assignee.name);
				}
			}
		}		
		String type = "sprint "+s.id;
		Snapshot snap = new Snapshot();
		snap.user = user;
		snap.type = type;
		snap.board = b;
		snap.sprint = s;
		snap.data = data;
		snap.Columnsofsnapshot = Columnsofsnapshot;
		snap.save();
		s.finalsnapshot=snap;
		s.save();
		long ID = snap.id;
		renderJSON(ID);
		
	}

	/**
	 * Takes the sprint ID and load the same things needed to load the board
	 * then start changing the dynamic variables like tasks into strings
	 * including names then save everything in a new snapshot and then associate
	 * it to a meeting
	 * 
	 * @author Amr Abdelwahab
	 * @param sprintID
	 *            the sprint the board related to
	 * @param meetingID
	 *            the id of the meeting the snapshot shall be associated to
	 */
	public static void TakeMeetingSnapshot(long sprintID, long id) {
		Meeting M = Meeting.findById(id);
		Sprint s = Sprint.findById(sprintID);
		Project p = s.project;
		Board b = p.board;
		User user = Security.getConnected();
		List<Component> components = p.getComponents();

		ArrayList<ComponentRowh> data = new ArrayList<ComponentRowh>();
		List<Column> columns = b.columns;
		List<Column> CS =new ArrayList<Column>();
		ArrayList<String> Columnsofsnapshot = new ArrayList<String>();
		for( int i=0; i<columns.size();i++)
		{
			if(columns.get( i ).onBoard==true)
			{
				CS.add( columns.get( i ) );
			}
		}
		for (int i = 0; i < CS.size(); i++) {
			Columnsofsnapshot.add(null);
			Columnsofsnapshot.set(i, CS.get(i).name);
		}

		int smallest;
		Column temp;
		for (int i = 0; i < CS.size(); i++) {
			smallest = i;
			for (int j = i + 1; j < CS.size(); j++) {
				if (CS.get(smallest).sequence > CS.get(j).sequence) {
					smallest = j;

				}

			}
			temp = CS.get(smallest);
			CS.set(smallest, columns.get(i));
			CS.set(i, temp);
			Columnsofsnapshot.set(smallest, CS.get(i).name);
			Columnsofsnapshot.set(i, temp.name);
		}

		for (int i = 0; i < components.size(); i++)// for each component get
		// the tasks
		{
			data.add(null);
			data.set(i, new ComponentRowh(components.get(i).id, components.get(i).name));
			List<Task> tasks = components.get(i).returnComponentTasks(s);

			for (int j = 0; j < CS.size(); j++) {
				data.get(i).add(null);
				data.get(i).set(j, new ArrayList<String>());
			}

			for (Task task : tasks) {
				Column pcol = new Column();
				for(int k=0;k<task.taskStatus.columns.size();k++)
				{
					pcol = task.taskStatus.columns.get(k);
					if(pcol.board.id==b.id)
					{
						break;
					}
				}
				if(pcol.onBoard==true&&!pcol.deleted)
				{
				data.get(i).get(CS.indexOf(pcol)).add("(" + task.taskStory.description + ")" + "T" + task.id + "-" + task.description + "-" + task.assignee.name);
				}
			}
		}
		Snapshot snap = new Snapshot();
		snap.user = user;
		snap.type =M.name+ " Meeting";
		snap.board = b;
		snap.sprint = s;
		snap.data = data;
		snap.Columnsofsnapshot = Columnsofsnapshot;
		snap.save();
		M.snapshot = snap;
		M.save();
		Calendar cal = new GregorianCalendar();
		Logs.addLog(user, "Attached a snapshot", "Meeting", M.id, p, cal.getTime());
	}

	/**
	 * Renders the data needed to load the snapshot
	 * 
	 * @author Amr Abdelwahab
	 * @param id
	 */

	public static void LoadSnapShot(long id) {
		Snapshot snap = Snapshot.findById(id);
		ArrayList<String> Columnsofsnapshot = snap.Columnsofsnapshot;
		ArrayList<ComponentRowh> data = snap.data;
		Project p= snap.board.project;
		render(Columnsofsnapshot, data,snap,p);

	}

	/**
	 * Renders a list of the snapshots now sorted by date
	 * 
	 * @author Amr Abdelwahab
	 *@param id
	 *            the id of the sprint
	 *@param type
	 *            the string that filters the list of board according to its
	 *            type
	 */
	public static void index(long id, String type) {

		List<Snapshot> snapshots = Snapshot.find("sprint.id = ? and type = ? ", id, type).fetch();
		if(snapshots.size()!=0){Sprint s=snapshots.get(0).sprint;
		render(snapshots,type,s);}
		render(snapshots,type);
	}
	public static void indexuser(long id, String type) {

		List<Snapshot> snapshots = Snapshot.find("sprint.id = ? and type = ? and user=? ", id, type,Security.getConnected()).fetch();
		
		render(snapshots,type);

	}

	/**
	 * Takes the sprint ID and the component id and load the same things needed
	 * to load the board then start changing the dynamic variables like tasks
	 * into strings including names then save everything in a new snapshot and
	 * then associate it to a meeting
	 * 
	 * @author Amr Abdelwahab
	 * @param sprintID
	 *            the sprint the board related to
	 * @param componentID
	 *            the id of the component the snapshot is taken for its board
	 */
	public static void TakeComponentSnapshot(long sprintID, long componentID) {
		Sprint s = Sprint.findById(sprintID);
		Project p = s.project;
		Board b = p.board;

		Component c = Component.findById(componentID);
		List<User> users = c.getUsers();
		ArrayList<ComponentRowh> data = new ArrayList<ComponentRowh>();
		List<Column> columns = b.columns;
		ArrayList<String> Columnsofsnapshot = new ArrayList<String>();
		List<Column> CS =new ArrayList<Column>();
				for( int i=0; i<columns.size();i++)
		{
			if(columns.get( i ).onBoard==true)
			{
				CS.add( columns.get( i ) );
			}
		}
		for (int i = 0; i < CS.size(); i++) {
			Columnsofsnapshot.add(null);
			Columnsofsnapshot.set(i, CS.get(i).name);
		}

		int smallest;
		Column temp;
		for (int i = 0; i < CS.size(); i++) {
			smallest = i;
			for (int j = i + 1; j < CS.size(); j++) {
				if (CS.get(smallest).sequence > CS.get(j).sequence) {
					smallest = j;

				}

			}
			temp = CS.get(smallest);
			CS.set(smallest, columns.get(i));
			CS.set(i, temp);
			Columnsofsnapshot.set(smallest, CS.get(i).name);
			Columnsofsnapshot.set(i, temp.name);
		}

		for (int i = 0; i < users.size(); i++)// for each component get
		// the tasks
		{
			data.add(null);
			data.set(i, new ComponentRowh(users.get(i).id, users.get(i).name));
			List<Task> tasks = users.get(i).returnUserTasks(s, componentID);

			for (int j = 0; j < CS.size(); j++) {
				data.get(i).add(null);
				data.get(i).set(j, new ArrayList<String>());
			}

			for (Task task : tasks) {
				Column pcol = new Column();
				for(int k=0;k<task.taskStatus.columns.size();k++)
				{
					pcol = task.taskStatus.columns.get(k);
					if(pcol.board.id==b.id)
					{
						break;
					}
				}
				if(pcol.onBoard==true&&!pcol.deleted)
				{
				data.get(i).get(CS.indexOf(pcol)).add("(" + task.taskStory.description + ")" + "T" + task.id + "-" + task.description + "-" + task.assignee.name);
				}
			}
		}	User user = Security.getConnected();

		Snapshot snap = new Snapshot();
		snap.user = user;
		snap.type = c.name;
		snap.board = b;
		snap.sprint = s;
		snap.data = data;
		snap.Columnsofsnapshot = Columnsofsnapshot;
		snap.save();
		Calendar cal = new GregorianCalendar();
		Logs.addLog(user, "Took", "Snapshot", snap.id, p, cal.getTime());
	}

	/**
	 * Takes the sprint ID and load the same things needed to load the board
	 * then start changing the dynamic variables like tasks into strings
	 * including names then save everything in a new snapshot and then associate
	 * it to a meeting
	 * 
	 * @author Amr Abdelwahab
	 * @param sprintID
	 *            the sprint the board related to
	 * @param componentID
	 *            the id of the component the snapshot is taken for its board
	 * @param meetingID
	 *            the id of the meeting the snapshot shall be associated to
	 */
	public static void TakeComponentMeetingsnapshot(long sprintID, long componentID, long meetingID) {
		Meeting M = Meeting.findById(meetingID);
		Sprint s = Sprint.findById(sprintID);
		Project p = s.project;
		Board b = p.board;

		Component c = Component.findById(componentID);
		List<User> users = c.getUsers();
		ArrayList<ComponentRowh> data = new ArrayList<ComponentRowh>();
		List<Column> columns = b.columns;
		ArrayList<String> Columnsofsnapshot = new ArrayList<String>();
		List<Column> CS =new ArrayList<Column>();
				for( int i=0; i<columns.size();i++)
		{
			if(columns.get( i ).onBoard==true)
			{
				CS.add( columns.get( i ) );
			}
		}
		for (int i = 0; i < CS.size(); i++) {
			Columnsofsnapshot.add(null);
			Columnsofsnapshot.set(i, CS.get(i).name);
		}

		int smallest;
		Column temp;
		for (int i = 0; i < CS.size(); i++) {
			smallest = i;
			for (int j = i + 1; j < CS.size(); j++) {
				if (CS.get(smallest).sequence > CS.get(j).sequence) {
					smallest = j;

				}

			}
			temp = CS.get(smallest);
			CS.set(smallest, columns.get(i));
			CS.set(i, temp);
			Columnsofsnapshot.set(smallest, CS.get(i).name);
			Columnsofsnapshot.set(i, temp.name);
		}

		for (int i = 0; i < users.size(); i++)// for each component get
		// the tasks
		{
			data.add(null);
			data.set(i, new ComponentRowh(users.get(i).id, users.get(i).name));
			List<Task> tasks = users.get(i).returnUserTasks(s, componentID);

			for (int j = 0; j < CS.size(); j++) {
				data.get(i).add(null);
				data.get(i).set(j, new ArrayList<String>());
			}

			for (Task task : tasks) {
				Column pcol = new Column();
				for(int k=0;k<task.taskStatus.columns.size();k++)
				{
					pcol = task.taskStatus.columns.get(k);
					if(pcol.board.id==b.id)
					{
						break;
					}
				}
				if(pcol.onBoard==true&&!pcol.deleted)
				{
				data.get(i).get(CS.indexOf(pcol)).add("(" + task.taskStory.description + ")" + "T" + task.id + "-" + task.description + "-" + task.assignee.name);
				}
			}
		}	User user = Security.getConnected();

		Snapshot snap = new Snapshot();
		snap.user = user;
		snap.type =M.name+ " Meeting";
		snap.board = b;
		snap.sprint = s;
		snap.data = data;
		snap.Columnsofsnapshot = Columnsofsnapshot;
		snap.save();
		M.snapshot = snap;
		M.save();
		Calendar cal = new GregorianCalendar();
		Logs.addLog(user, "Attached a snapshot", "Meeting", M.id, p, cal.getTime());
	}

}
