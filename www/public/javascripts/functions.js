﻿﻿﻿﻿﻿﻿﻿ $.extend($.gritter.options, { 
	fade_in_speed: 50, // how fast notifications fade in (string or int)
	fade_out_speed: 300, // how fast the notices fade out
	time: 5000 // hang on the screen for...
});

var CURRENT_PROJECT = 0;

function reload_board(sid,compId)
{
	$('#theLoadedContent').contents().find('#mainBoard').load('/boards/loadboard1?sprintID='+sid+' #mainBoard');
}
function reload_note_open(sid, taskId, compId, userId) {
	$('#theLoadedContent').contents().find('#task-'+taskId+'_T_0').load('/boards/loadboard1?sprintID='+sid+' #task-'+taskId+'_T_0', 
	function()
	{
		$('#theLoadedContent').contents().find('#'+taskId+'_button').click();
		$('#theLoadedContent').contents().find('#sideMeet').find('#'+userId+'_user').click();
	});
	if(compId!=0)
	$('#theLoadedContent').contents().find('#task-'+taskId+'_T_'+compId).load('/boards/loadboard1?sprintID='+sid+'&componentID='+compId+' #task-'+taskId+'_T_'+compId,
	function()
	{
		$('#theLoadedContent').contents().find('#'+taskId+'_button').click();
	});
}
function reload_note_close(sid, taskId, compId)
{
	$('#theLoadedContent').contents().find('#task-'+taskId+'_T_0').load('/boards/loadboard1?sprintID='+sid+' #task-'+taskId+'_T_0');
	if(compId!=0)
	$('#theLoadedContent').contents().find('#task-'+taskId+'_T_'+compId).load('/boards/loadboard1?sprintID='+sid+'&componentID='+compId+' #task-'+taskId+'_T_'+compId);
}
function drag_note_status(sid, assigneeId, oldcol, newcol, compId,taskId)
{
	$.post('/boards/loadboard1?sprintID='+sid, function(data)
	{
		$('#theLoadedContent').contents().find('#'+oldcol+'_'+compId+'_0').find('#task-'+taskId+'_T_0').remove();
		$('#theLoadedContent').contents().find('#'+newcol+'_'+compId+'_0').find('#task-'+taskId+'_T_0').remove();
		$('#theLoadedContent').contents().find('#'+newcol+'_'+compId+'_0').append($(data).find('#task-'+taskId+'_T_0'));
	})
	
	if (compId != 0) 
	{
		
		$.post('/boards/loadboard1?sprintID='+sid+'&componentID='+compId, function(data2)
		{
			
			$('#theLoadedContent').contents().find('#'+oldcol+'_'+assigneeId+'_'+compId).find('#task-'+taskId+'_T_'+compId).remove();
			$('#theLoadedContent').contents().find('#'+newcol+'_'+assigneeId+'_'+compId).find('#task-'+taskId+'_T_'+compId).remove();
			$('#theLoadedContent').contents().find('#'+newcol+'_'+assigneeId+'_'+compId).append($(data2).find('#task-'+taskId+'_T_'+compId));
		})
	}
}
function drag_note_assignee(sid, oldassi, newassi, col, compId, taskId)
{
	if (compId != 0) 
	{
		$.post('/boards/loadboard1?sprintID='+sid+'&componentID='+compId, function(data)
		{
			
			$('#theLoadedContent').contents().find('#'+col+'_'+oldassi+'_'+compId).find('#task-'+taskId+'_T_'+compId).remove();
			$('#theLoadedContent').contents().find('#'+col+'_'+newassi+'_'+compId).find('#task-'+taskId+'_T_'+compId).remove();
			$('#theLoadedContent').contents().find('#'+col+'_'+newassi+'_'+compId).append($(data).find('#task-'+taskId+'_T_'+compId));
		})
	}
}
function request_accept( id, hash )
{
	$.post('/requests/requestAccept' ,
		    {hash:hash, id:id})
}
function request_accept2( id, hash )
{
	$.post('/requests/deletionRequestAccept' ,
		  {hash:hash})
}
function request_ignore( id, hash)
{
	$.post('/requests/requestIgnore' ,
		    {hash:hash})
		}
function show_comment(id){

	$('#comment_'+id).show();
	}
function do_ignore(id, hash){
	var textValue = $('#text_'+id).val();
	if(textValue == '')
		$.bar({message:'You must Enter a reason why you declined this request!'})
	else
	{
		$.post('/requests/requestIgnore' ,
		    {hash:hash, body:textValue})
	}
}
function delete_meeting(id)
{
	var confirmation= confirm("Are you sure you want to delete this meeting ?");
	
	if (confirmation) {
		$.post('/Meetings/deleteMeeting', {id:id},function(){$.bar({ message:'Meeting deleted successfully.' })});
	}	
}
function join_meeting(id)
{
	if(confirm("Join meeting?"))
	$.post('/Meetings/joinMeeting',{meetingID: id}
	,function(flag)
	{
		if(flag)
			{
			$.bar({ message:'You have successfully joined the meeting.' })
		$('#accepts_'+id).hide();
		$('#acceptsMeetings_'+id).hide();
		$('#confirmedd_'+id).show();
		$('#confirmeddMeetings_'+id).show();
			}
		else
			{
			$.bar({
				message : 'Meeting has already ended.'
			});
			$('#accepts_'+id).hide();
			$('#acceptsMeetings_'+id).hide();
			}
	})
}
function confirm_me(id)
{
	if(confirm("Change your status to attending?"))
	$.post('/MeetingAttendances/confirmAttendance',{meetingId: id}
	,function(flag)
	{
		if(flag)
			{
		$.bar({
			message : 'You accepted the invitation.'
		});
		$('#inv_'+id).hide();
		$('#accept_'+id).hide();
		$('#decline_'+id).hide();
		$('#confirmed_'+id).show();
		$('#inv_'+id).hide();
		$('#meet_'+id).hide();
		$('#acceptMeetings_'+id).hide();
		$('#declineMeetings_'+id).hide();
		$('#confirmedMeetings_'+id).show();
			}
		else
			{
			$('#inv_'+id).hide();
			$('#accept_'+id).hide();
			$('#decline_'+id).hide();
			$('#meet_'+id).hide();
			$('#acceptMeetings_'+id).hide();
			$('#declineMeetings_'+id).hide();
			
				$.bar({
					message : 'Meeting has already ended.'
				});
			}

	})
}
function requestRole(roleIdd){
	$.post('/projecttasks/requestRole', {id:roleIdd}, function(msg){
		$.bar({message:msg});
	});
}
function revokeRole(roleId, baseRole, userId, projectId)
{
	var confirmation;
	if(baseRole)
	{
		confirmation= confirm("Are you sure you want to revoke this role? Notice that by revoking this role the user is no longer a member in this project.");
	}
	else
	{
		confirmation= confirm("Are you sure you want to revoke this role?");
	}
	if (confirmation) 
	{
		$.post('/projectTasks/revokeRole', {roleId:roleId, userId:userId}, 
				function(msg)
				{
			      arr = msg.split('|')
			      if (arr.length > 0 && arr[0]) 
			      {
			    	  $.bar({message: arr[0]});
			      }
			      if (arr.length > 1 && arr[1]) 
			      {
			    	  eval(arr[1]);
			      }
			      if (arr.length > 2 && arr[2]) 
			      {
			    	  eval(arr[2]);
			      }
			    });
	};
}
function deleteRequest(roleIdd){
	if(confirm("Are you sure you want to cancel your request?")){
		$.post('/requests/removeRequestRoleInProject', {roleId:roleIdd}, function(msg){
			$.bar({message:msg});
		});
	}
}
function decline_me(id)
{
	var reno=prompt("Please enter the reason :","");
	while(reno.length==0)
	{
		reno=prompt("Please enter the reason :","");
	}
	$.post('/MeetingAttendances/declineAttendance',{meetingId:id , reason:reno},
	function(flag)
	{
		if(flag)
			{
		$.bar({
			message : 'You Declined the invitation.'
		});
		$('#inv_'+id).hide();
		$('#declined_'+id).show();
		$('#accept_'+id).hide();
		$('#decline_'+id).hide();
		$('#meet_'+id).hide();
		$('#declinedMeetings_'+id).show();
		$('#acceptMeetings_'+id).hide();
		$('#declineMeetings_'+id).hide();
			}
		else
			{
			$.bar({
				message : 'Meeting has already ended.'
			});
			$('#inv_'+id).hide();
			$('#accept_'+id).hide();
			$('#decline_'+id).hide();
			$('#meet_'+id).hide();
			$('#acceptMeetings_'+id).hide();
			$('#declineMeetings_'+id).hide();
			}
	
	}
	);
}
function deleteStory(sId,box,d){
	message = "Are you sure you want to delete this story?";
	if(d)
		message+= " Some stories depend on it.";
	if((confirm(message)))
	{
		$.post('/Storys/delete', {id:sId}, function(data){
			$.bar({message:data});
		});
	}
}
function fixZ (that)
{
	$('.draggable').each(function(){
		if($(this)!=that)
		{
			$(this).css('z-index','9993');
			//$(this).addClass('dim');
		}
	});
}
function adjustHeight(el)
{
	if($("#"+el).position() == null)
	{
		var children = $("#"+el).closest(".workspaceDraggables").find("div.draggable");
		var max = 0;
		for(var i = 0; i< children.length; i++)
		{
			var height = ($(children[i]).height()+$(children[i]).position().top);
			if(height > max)
				max = height;
		}
		
		$('#mainTable').css('height','100%');
		if(max > $('#mainTable').height())
			$('#mainTable').height(max+100);
		else
			$('#mainTable').css('height','100%');
		
	}
	else if(($('#mainTable').height()-100)<= ($("#"+el).height()+$("#"+el).position().top))
	{	
		$('#mainTable').height($("#"+el).height()+$("#"+el).position().top+100);
	}
	else
	{
		var children = $("#"+el).closest(".workspaceDraggables").find("div.draggable");
		var max = ($("#"+el).height()+$("#"+el).position().top);
		for(var i = 0; i< children.length; i++)
		{
			var height = ($(children[i]).height()+$(children[i]).position().top);
			if(height > max)
				max = height;
		}
		
		$('#mainTable').css('height','100%');
		if(max > $('#mainTable').height())
			$('#mainTable').height(max+100);
		else
			$('#mainTable').css('height','100%');
	}
}

DRAGGING_ELEMENT = null
$(function() {
	$(this).parent().find('.dropper').hide();
	$('.dragger').live('mouseover', function()
	{
		if ($(this).data('init')) return
		$(this).data('init', true)
		$(this).draggable({
			helper: 'clone',
			zIndex: '9999999',
			start: function(event, ui) {
				DRAGGING_ELEMENT = $(this).closest('.draggableChild').attr('id')
				if (!DRAGGING_ELEMENT) {
					DRAGGING_ELEMENT = $(this).closest('.draggable').attr('id')
				}
				that = this
				$('.dropper').each(function() {
					$(this).show();

					if ($(this).data('init')) return
					$(this).data('init', true)
					$(this).droppable({
						addClasses: false,
						tolerance: 'touch',
						drop: function(event2, ui2) {
							$(this).attr('src', '/public/images/loading16.gif')
							// alert($(ui.helper).attr('name'))
							$.ajax({
								url: '/ajax/dynamicdrop',							
								data: {from: $(that).attr('name'), to: $(this).attr('name')},
								success: function(response) {
									arr = response.split('|')
									if (arr.length > 0 && arr[0]) {
										$.bar({message: arr[0]})
									}	
									if (arr.length > 1 && arr[1]) {
										eval(arr[1])
									}
								}, 
								error: function(response) {
									$.bar({
										message: 'An error occurred. You may not have permission to perform that action.'
									})
								}
							})
						}
					})
				})
			},
			stop: function(element, ui) {
				$('.dragger').hide()
				$('.dropper').hide().attr('src', '/public/images/famfam/arrow_in.png')
				$(ui.helper).remove()
				DRAGGING_ELEMENT = null
			}
		});

		$(this).parent().find('.dropper').hide();
		})
	
	$('.draggable').live('click',function(){
		var that = $(this);
		fixZ(that)
		//$(this).removeClass('dim');
		$(this).css('z-index','9994');
		
	});
	$('.draggable>.actual').live('click',function(){
		var that = $(this).closest('.draggable');
		fixZ(that)
		//$(this).closest('.draggable').removeClass('dim');
		$(this).closest('.draggable').css('z-index','9994');
	});
	$('.draggable>.mainH').live('click',function(){
		var that = $(this).closest('.draggable');
		fixZ(that)
		//$(this).closest('.draggable').removeClass('dim');
		$(this).closest('.draggable').css('z-index','9994');
	});

	$('.draggable').live('mouseover', function() {
		//$(this).removeClass('dim');
		var h = $(this).height();
		if (!DRAGGING_ELEMENT) {
			$(this).children().children('.dragger').show()					
		}
		if($(this).hasClass('chat'))
		{
			$(this).resizable({
				disable:false,
				minWidth:300,
				minHeight:300,
				maxHeight:$(this).height(),
				delay : 0,
				distance: 0,
				containment: '#workspaces',start:function(){
				$(this).css('zIndex','9994')},
			});
			
		}
		else
		{
			$(this).resizable({
				disable:false,
				minWidth:300,
				minHeight:70,
				delay : 0,
				distance: 0,
				containment: '#workspaces',start:function(){$(this).css('zIndex','9994')},
				resize: function(event, ui) 
				{
					var test = ($(this).find(".normalLinkn span")).first();
					smart_pagination(test, 1, true);
					$(this).css('height','');
			//		alert('');
				$(this).find('.taskSummary').each(function()
				{
					if($(this).width()>$(this).next().width())
						$(this).next().next().hide();
					else
						$(this).next().next().show();
				});
				
				}
			});
		}
		
		if ($(this).data('init')) return
		$(this).data('init', 1);
		var con = $(this).closest('.workspaceDraggables').attr('id');
		$(this).css('z-index','9995');
		$(this).draggable({
			handle : '.ui-widget-header',
			cancel : 'a',
			stack  : '.draggable',
			containment: '#workspaces',
		});
	}).live('mouseout', function() {
		if ($(this).attr('id') != DRAGGING_ELEMENT) {
			$(this).children().children('.dragger').hide()
		}
		// if($(this).css('z-index')=='9993')
		// 	$(this).addClass('dim');
	}).live('mousedown', function() {
			// $(this).removeClass('dim');
	}).live('mouseenter', function() {
			// $(this).removeClass('dim');
	}).live('mouseleave', function() {
		// if($(this).css('z-index')=='9993')
		// 	$(this).addClass('dim');
	});;
		
	$(".draggableChild").live('mouseout', function() {
		if ($(this).attr('id') != DRAGGING_ELEMENT) {
			$(this).children().children('.dragger').hide()
		}
	}).live('mouseover',function() {
				if (!DRAGGING_ELEMENT) {
					$(this).children().children('.dragger').show()					
				}
				$(this).resizable({
					disable:true,});
				if ($(this).data('init')==true) return
				$(this).data('init', true)
				$(this).draggable(
						{
							containment: '#workspace',
							handle : '.ui-widget-header',
							cancel : 'img',
							stack  : '.draggable',
							stop : function(event, ui) {
								is = $(this).hasClass('draggableChild')							
								if (is) {
									var el = $(this);
									var pos = el.position();
									var pos2 = el.closest('.draggable').position();
									el.css( {
										position : "absolute",
										marginLeft : 0,
										marginTop : 0,
										zIndex  : 9999999999999999999999,
										top :  pos.top+pos2.top,
										left :  pos.left+pos2.left
									});
									$(this).closest('.workspaceDraggables').append($(this));
								}
								adjustHeight($(this).attr('id'));
								$(this).draggable( {start : function(event, ui) {},stop : function(event, ui) {}});
								$(this).children().show();
								$(this).removeClass('draggableChild');
								$(this).addClass('draggable');
								$(this).find('.actual:first').html('');
								load($(this).attr('name'), $(this).attr('id'),1);
								fixZ($(this));
								// $(this).removeClass('dim');
								$(this).css('z-index','9994');
							},
							start : function(event, ui) {
								$(this).css('z-index','9995');
								var id = $(this).attr('id');
								$("#" + id + " .selectedBars").removeClass('selectedBars')
								$("#" + id + " .selectedBars2").removeClass('selectedBars2');
								$("#" + id + " .selectedBar").removeClass('selectedBar')
								$("#" + id + " .selectedBar2").removeClass('selectedBar2')
								$('#' + id + ' .ui-widget-content').hide();
								var t = $('#' + id + ' .ui-widget-header')
										.first().clone();
								$(t).removeClass('ui-widget-header');
								$(t).addClass('clone');
								$(t).removeClass('selectedBar');
								$(t).removeClass('selectedBar2');
								$(t).insertBefore($(this));
								$(t).attr('id', $(this).attr('id') + "_2");
							}
						});

			});
	$('#getOverlay').keypress(function(event){
		if (event.keyCode == '27')
		{	
			$(this).hide();
		}
	});
	$('#getOverlay').live('click',function(){
		$(this).hide();
	});

	$('.draggableChild .ui-widget-header').live(
			'click',
			function() {
				//alert($(this).attr('class'));
				if ($(this).hasClass('bar') || $(this).hasClass('overlay') ||$(this).parent().hasClass('overlay')) {
			//	alert('l');
					return;
				}
				if($(this).next().html()=='')
					load($(this).parent().attr('name'),$(this).parent().attr('id'), 3);

				if($(this).parents().length%4==0)
				{
					$(this).toggleClass('selectedBar');
					$(this).next().toggleClass('selectedBars');
				}
				else
				{
					$(this).toggleClass('selectedBar2');
					$(this).next().toggleClass('selectedBars2');
					
				}
				$(this).next().slideToggle(400,function(){
					adjustHeight($(this).closest('.draggable').attr('id'));
				});
		});

	$('.min').live(
			'click',
			function() {
				var el = $(this).parent().parent();

				if($(this).hasClass('draggable'))
				{	
					$(this).closest('.workspace').find('.workspaceDraggables').first().append($(this))
					el.removeClass('min')
				}
				else
				{	
					$(el).closest('.workspace').find('.dock').first().append($(el))
					el.addClass('min');
				}

				adjustHeight($(this).closest('.draggable').attr('id'));
			});
	$('.refresh').live('click',function(){
		var parent = $(this).parent().parent();
		$(parent).find('.actual:first').html('<div class="bar center"><img src="/public/images/loadingMagic.gif"></div>')
		load($(parent).attr('name'), $(parent).attr('id'), 1);
		adjustHeight($(this).closest('.draggable').attr('id'));
	});
	$('.revertFrom').live('click', function() {
		$(this).parent().parent().data('init', false);
		var url = $(this).parent().parent().attr('name');
		$(this).parent().next().hide();		
		removeFromDiv(url);
		var theId = $(this).parent().parent().attr('id');
		var theSecondId = theId + "_2";
		
		if ($('#' + theSecondId).attr('id') == null)
			$('#' + theId).remove();
		else 
		{
			var elHtml = $('#' + theSecondId).html();
			$('#' + theId).removeAttr('style');
			$('#' + theId).removeClass('draggable');
			$('#' + theId).addClass('draggableChild');			
			$('#' + theSecondId).replaceWith($('#' + theId));
			$('#' + theId).find('.mainH').first().html(elHtml);
			$('#' + theId).removeAttr('style');
			fixZ($('#' + theId).closest('.draggable'));
			load($('#' + theId).attr('name'),theId,5,0);
			// $('#' + theId).closest('.draggable').removeClass('dim');
			$('#' + theId).closest('.draggable').css('zIndex','9994');
			$('#' + theId).removeAttr('style');
			// $('#' + theId).removeClass('dim');
			$('#' + theId).removeAttr('style');
		}

		});
	});

		
function removeFromDiv(url)
{
	myDivs = $.grep(myDivs, function(value) {
	    return value != url;
	});
	var url2 = url+' .actual';
	myDivs = $.grep(myDivs, function(value) {		
	    return value != url2;
	});	

	adjustHeight($(this).closest('.draggable').attr('id'));
}

randomId = 100	
function load(url, el, n, hideLoading) {
	if (!hideLoading) $('#' + el + '_content').html('<div class="bar center"><img src="/public/images/loadingMagic.gif"></div>');
	//alert(url+' '+el+' '+n+' ');
		$.ajax({
			url: url,
			success: function(data) {
				$('body').append('<div id="dummy_data" class="hidden '+$('#'+el).attr('class')+'"></div>')
				$('#dummy_data').html(data)
				data = $('#dummy_data').html() 
				$('#'+el+'_content').html($(data).find('.actual:first').html());
				$('#dummy_data').remove()
				if (n != 3 && n!=5) {
					$('#'+el+'_header').html($(data).find('.mainH:first').html());
					if(n!=4)
					myDivs.push(url);
				}
				if (n == 1 || n==4) {
					$('#'+ el).append('<div class="filter" id="'+el+'_filter"></div>');
					$('#'+ el + '_filter').html($(data).find('.filter:first').html());
					$('#'+ el + '_filter').find('input:first').attr('name', 'filter_textBox_'+el);
				}
				magic(el);
				if(n!=5)
				$('#' + el + '_content').slideDown(400);
			}
		})
}

function randomInt(max, min) {
	if (!min) {
		min = 0;
	}
	random = Math.floor(Math.random() * (max-min)) + min;
	return random
}

// CURRENT_OFFSET = 10
function loadBox(url, el, classes) 
{
	if($.inArray(url,myDivs)==-1) {
				
		$.ajax({
			url: url,
			success: function(data) {
				$('body').append('<div id="dummy_data" class="hidden"></div>')
				$('#dummy_data').html(data)
				data = $('#dummy_data').html()
				$('#dummy_data').remove()
				myDivs.push(url)
				element = $(data).filter('div:first')
				var that = element;
				fixZ(that);
				element.attr('name', url)
				element.css('left', randomInt($('#'+el).width() - 450) + 'px');
				element.css('top', randomInt(200, 50) + 'px');
				element.addClass(classes);
				adjustHeight(element.attr('id'));
				element.css('z-index','9995');
				element.find('.bar:first').remove()
				element.find('.actual:first').show()
				$('#'+el).append(element)
				magic(element.attr('id'))
			}
		})
	}
}

function magic(id) {
	doOnLoad();
	smart_pagination(id,1,false);
	hideFilterLinks(id);
	$("#" + id + "_content div[name]").each(function(){
		$(this).find('.taskSummary').each(function(){
			if($(this).next().width()<=$(this).width())
				$(this).next().next().hide();
		});
		if($(this).hasClass('overlay'))
		{
			var id2 = "ui" +num;
			num++;
			var head = '<div id="'+id2+'_header" class="ui-widget-header"><a href="#" onclick="overlayOpen(\''+$(this).attr('name')+'\')"><span class="ui-icon ui-icon-extlink"></span></a>' + $(this).html()+ '</div>';
			$(this).html(head);
			$(this).attr('id', id2);
			
		}
		else
		{
			var url = $(this).attr('name');
			if($.inArray(url,myDivs)==-1)
			{
				var id2 = "ui" +num++;
				var head = '<div id="'+id2+'_header" class="ui-widget-header mainH"><span class="revertFrom"><span class="ui-icon ui-icon-circle-close"></span><span class="refresh ui-icon ui-icon-refresh"></span></span>' + $(this).html() + '</div>';
				$(this).html(head);
				$(this).addClass('draggableChild');
				$(this).attr('id', id2);
				$(this).append('<div id="' + id2 + '_content" class="ui-widget-content actual" ></div>');
			} else {	
				var id2 = $(this).closest('.workspaceDraggables').find('.draggable[name='+$(this).attr('name')+']').first().attr('id')+'_2';
				var head = '<div id="'+id2+'" class="mainH clone">' + $(this).html() + '</div>';
				$(this).replaceWith(head);
			}						
		}
	});

}
var myDivs = new Array();
var num =1;
function deleteTheTask(tId, box){
	
	if((confirm('Are you sure you want to delete the Task ?')))
	{
	
	$.post('/tasks/delete', {id:tId}, function(data){ $.bar({message:data}
	);
	// removeMe(box);
	;});
	}
}

function delete_meetingNote(nid,mid)
{
	if(confirm("Are you sure you want to delete this note?"))
		$.post('/meetings/deleteTheNote',{noteId: nid , meetingId:mid},
				function(flag)
				{
					if(flag)
						{
						$.bar({message: 'note deleted succesfully.'});
						}
				})
}

function set_attended(id)
{
	if(confirm("change status to attended??"))
	$.post('/meetingAttendances/setConfirmed',{id: id})
}

function set_didnot_attend(id)
{
	var reno=prompt("Please enter the reason :","");
	while(reno.length==0)
	{
		reno=prompt("Please enter the reason :","");
	}
	
		$.post('/meetingAttendances/setDeclined',{id:id , reason:reno})
	
}
searching_projects = null
function search_projects() {
	if ($('#project_search_text').val() == '') {
		$('#projects_search_results').html('')
		$('#search_results_h3').hide()
		return
	}
	$('#projects_search_results').html('<img src="/public/images/tinyLoading.gif">')
	if (searching_projects) {
		searching_projects.abort()
	}
	searching_projects = $.post('/ajax/projects', {query: $('#project_search_text').val(), notMine: true}, function(projects) {
		results = ''
		$(projects).each(function() {
			results += '<div id="project-search-result-'+this.id+'"><a onclick="showProjectWorkspace('+this.id+')">'+this.name+'</a></div>'
		})
		if (!$(projects).length) {
			results += '<div><a href="#" title="No results">---</a></div>'
		}
		$('#search_results_h3').show()
		$('#projects_search_results').html(results)
	})
}

function show(id) {
	if (id < 0) {
		$('#acp-workspace-help').show()
		$('#workspace-help').hide()
	} else {
		$('#acp-workspace-help').hide()
		$('#workspace-help').show()
	}
	if (!id) {
		$('#workspaces').hide()
		$('#normal').load('/ #normal',function(){
	$(this).replaceWith($(this).html());$('#sideEvent').html('')
	$('#noti').load('/Application/showNotifications');
		$('#events').load('/Application/showEvents');
		$('#in').load('/Invites/showInvitations');
		;
		});
		$('#normal').show()
		$('.project-button').removeClass('selectedADiv')
	} else if ($('.workspace-'+id).length) {
		CURRENT_PROJECT = id;
		// make sure we have that thingie first
		// DO NOT load workspace here, it might have been removed on purpose!
		$('#normal').hide();
		$('#workspaces').show()
		$('.workspace').hide()
		$('.workspace-' + id).show()
		$('.project-button').removeClass('selectedADiv')
		$('#project-button-'+id).addClass('selectedADiv')	
	}
}
function closeWindows(el)
{
	$('#workspace-'+el+' div[name]').each(function(){
		removeFromDiv($(this).attr('name'));
		$(this).remove();
	});
	$('#chatContainer_'+el).hide();
}

function close_workspace(project_id) {
	$('#project-button-'+project_id).fadeOut(function() {
		$(this).remove()
	})
	closeWindows(project_id)
	$('.workspace-'+project_id).remove()
	show(0)
}


function showProjectWorkspace(project_id) {
	$('#normal').html('');
	if ($('.workspace-'+project_id).length) {
		$('#top_header_projects_pane').slideUp()
		show(project_id)
		return
	}
	$('#workspaces').append('<div class="workspace workspace-'+project_id+'"><div style="display:table"class="transparentOverlay"><div style="text-align:center;vertical-align:middle;display:table-cell"><img src="/public/images/loading.gif"></div></div>');
	show(project_id)
	// return
	$.ajax({
		async: false,
		url: '/show/workspace',
		data: {id: project_id},
		success: function(data) {
			$('#project-tabs').append('<a class="aDIV topCornersRounded selectedADiv project-button " id="project-button-'+project_id+'" href="#" onclick="show('+project_id+')" style="width: 120px !important" title="">'+$(data).find('.project_name_in_header').html()+' <span class="right ui-icon2 ui-icon-circle-close" onclick="close_workspace('+project_id+')"> </span></a>');
			$('.workspace-' + project_id).html(data)
			$('#top_header_projects_pane').slideUp()
		}
	})
}

function reload() {
	// don't reload the same box more than once, just making sure nobody is
	// abusing our system
	reloaded = new Array()
	for (var i = 0; i < arguments.length; i++) {
		sel = '.reload-' + arguments[i]
		if ($.inArray(sel, reloaded) != -1) {
			continue
		}
		reloaded.push(sel)
		$(sel).each(function() {
			url = $(this).attr('name')
			removeFromDiv(url)
			// alert('Reloading: ' + url)
			exit = false
			$.ajax({
				url: url,
				async: false,
				error: function() {
					exit = true
				}
			})
			if (exit) {
				$(this).remove()
				return
			}
			load(url, $(this).attr('id'), 4, true)
		})
	}
}
function deleteTheComponent(cId, box){
	if((confirm('Are you sure you want to delete the component?')))
	{
		$.post('/components/delete', {id:cId}, function(data){ 
				$.bar({message:data});
			});
	}
}

function fix(obj)
{
	$(obj).find('.taskSummary').each(function(){
		if($(this).width()>=$(this).next().width())
			$(this).next().next().hide();
		else
			$(this).next().next().show();
	});
}

var timer_spans= new Array();

function isPresentInArray(place)
{
	for(i=0;i<timer_spans.length;i++){
		if(timer_spans[i].place == place){
			return timer_spans[i];
		}
	}
	return false;
}

function showDate(id,place,startTime,nam,type) 
{
	var placeObject=isPresentInArray(place);
	if(placeObject==false)
		{
		placeObject=new Object();
		placeObject.place=place;
		placeObject.counter=0;
		timer_spans.push(placeObject);
		}
	else
		{
		placeObject.counter++;
		}
	var counter= placeObject.counter;
	var date=startTime;
	if(startTime<new Date().getTime())
		return;
	var tz =0;         //  
	var lab = place;    // The id of the page entry where the timezone countdown
						// is to show
	var name= ""+nam
	displayTZCountDown(setTZCountDown(date,tz),lab,id,nam,type,counter);
}
function setTZCountDown(date,tz) 
{
	var toDate=new Date(date);
	var fromDate = new Date();
	fromDate.setMinutes(fromDate.getMinutes());
	var diffDate = new Date(0);
	diffDate.setMilliseconds(toDate - fromDate);
	return Math.floor(diffDate.valueOf()/1000);
}
function displayTZCountDown(countdown,place,id,name,type,counter) 
{
	
	if(document.getElementById(place)==null)
		return;
	if(countdown<0)
	{
		if(type=="meeting")
			{
				$.post("/Meetings/reloadMeeting",{id:id})
			}
		else if(type=="task")
			{
				$.post("/Tasks/reloadTask",{id:id})
			}
		else if(type=="sprint")
			{
				$.post("/Sprints/reloadSprint",{id:id})
			}
		return;
	}
	
	var secs = countdown % 60; 
	if (secs < 10) secs = '0'+secs;
	var countdown1 = (countdown - secs) / 60;
	var mins = countdown1 % 60; 
	if (mins < 10) mins = '0'+mins;
	countdown1 = (countdown1 - mins) / 60;
	var hours = countdown1 % 24;
	var days = (countdown1 - hours) / 24;

	if(days== '00' && hours=='00'&& mins=='05' && secs=='00') 
	{
		alert("5 minutes remaining on  "+name)
	}
	var timer="";
	if(days>7)
	{
		timer = parseInt(days/7) + "W"
	}
	else
	{
		if(days<=7 && days >0)
		{
			timer = days + "D" +hours+ "H"
		}
		else
		{
			if(hours>0)
			timer = hours + "H" + mins + "M"
			else
				timer= mins + "M" + secs + "S"	
		}
	}
	var placeObject=isPresentInArray(place);
	
	if(placeObject.counter==counter)
	{
	
	document.getElementById(place).innerHTML= timer;
	setTimeout('displayTZCountDown('+(countdown-1)+',"'+place+'",'+id+',"'+name+'" , "'+type+'" , '+counter+');',999);
	}
}

function request_reviewer(tasktypeId)
{
	$.post('/requests/requestReviewer', {taskTypeId:tasktypeId},function(msg){
		$.bar({message:msg});
	});
}

function revoke_reviewer(uid, ttid)
{
	var r = confirm('Are you sure you want to revoke that reviewing role ?');
	if(r==true)
	{$.post('/requests/revokeReviewer', {uId:uid, taskTypeId:ttid}, function(msg){
		$.bar({message:msg});
	});}
}

function cancel_reviewer_request(ttid)
{
	var r = confirm('Are you sure you want to cancel the request ?');
	if(r==true)
	{$.post('/requests/cancelReviewerRequest', {taskTypeId:ttid}, function(msg){
		$.bar({message:msg});
	});}
}

function review_request_respond(revid , res)
{
	$.post('/requests/reviewRequestRespond', {revId:revid, response:res});
}

function message_bar(message) {
	$.bar({message: message})
}
function changeTitle(){
	var c = $('#month').val();
	var d = $('#year').val();
	if(c==1){
		$('#title').html("January "+d);
		
	}
	if(c==2){
		$('#title').html("February "+d);
		
	}
	if(c==3){
		$('#title').html("March "+d);
		
	}
	if(c==4){
		$('#title').html("April "+d);
		
	}
	if(c==5){
		$('#title').html("May "+d);
		
	}
	if(c==6){
		$('#title').html("June "+d);
		
	}
	if(c==7){
		$('#title').html("July" +d);
		
	}
	if(c==8){
		$('#title').html("August "+d);
		
	}
	if(c==9){
		$('#title').html("September "+d);
		
	}
	if(c==10){
		$('#title').html("October "+d);
		
	}
	if(c==11){
		$('#title').html("November "+ d);
	}
	if(c==12){
		$('#title').html("December "+ d);
	}

	}


function approveProjectRequest(id){
	var conf=confirm("Are you sure you want to approve this Project?");
	var msg=document.getElementById("message_"+id).value;
	if(conf){
		$.post('/projects/approveRequest',{id:id,message:msg},function (flag){
			if(flag){
				// alert("Project Has Been Approved. A Notification Has Been
				// sent to Project Owner !");
				message_bar("Project has been approved. A notification has been sent to the project owner.")
			}
		},'json')
	}

}


function declineProjectRequest(id){
	var conf=confirm("Are you sure you want to Decline this Project?");
	var msg=document.getElementById("message_"+id).value;
	if(conf){
		$.post('/projects/declineRequest',{id:id,message:msg},function (flag){
			if(flag){
				// alert("Project Has Been Declined. A Notification Has Been
				// sent to Project Owner !");
				message_bar("Project has been declined. A notification has been sent to project owner.")
			}
		},'json')
	}
}
$(function() {
	$('.editable')
		.live('mouseover', function() {
			// alert(this)
			if ($(this).data('init')) return
			$(this).data('init', true)
			$(this).attr('contenteditable', true)
			$(this).blur(function() {
				$.post($(this).attr('update_url'), {new_value: $(this).text()})
			})
		})
})

function update_title(new_title) {
	$('head title').html(new_title)
}