package models;

import play.*;
import play.db.jpa.*;

import javax.persistence.*;
import java.util.*;

/**
 * Stores updates sent to users per request
 */
@Entity
public class Update extends SmartModel {
	/**
	 * Javascript code to run on clients side
	 */
	public String javascript;
	
	/**
	 * timestamp of this update
	 */
	public long timestamp;
	
	/**
	 * user involved for this update - many updates per user, one user per update
	 */
	@ManyToOne
	public User user;
	
	/**
	 * Adds an update for this user
	 * @param user User involved
	 * @param javascript javascript code to execute at client side
	 */
	public static void update(User user, String javascript) {
		Update update = new Update();
		update.user = user;
		update.javascript = javascript;
		update.timestamp = new Date().getTime();
		update.save();
	}
	
	/**
	 * Adds an update for this project users
	 * @param project Project involved
	 * @param javascript javascript code to execute at client side
	 */
	public static void update(Project project, String javascript) {
		for (User user : project.users) {
			Update.update(user, javascript);
		}
	}
	
	/**
	 * Adds an update for this list except for the given user
	 * @param users List of users
	 * @param user User to exclude
	 * @param javascript Javascript code to execute at client side
	 */
	public static void update(List<User> users, User user, String javascript) {
		for (User tmpUser : users) {
			if (tmpUser == user) {
				continue;
			}
			Update.update(tmpUser, javascript);
		}
	}
}

