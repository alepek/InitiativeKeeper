
Gui =
{
	AddNewCharacter: function(character)
	{
		var imageUrl= character.imageUrl;
		var name = character.name;
		var identifier = character.identifier;
		var widget = Gridster.add_widget("<li id="+identifier+" data-row=\"1\" data-col=\"1\" data-sizex=\"1\" data-sizey=\"1\" class=\"slightBorder character\">"+
                "<div class=\"btn-group btn-group-justified cloneRemoveButtons\">"+
                "<a type=\"button\" class=\"btn btn-default cloneCharacter \">Clone</a>"+
                "<a type=\"button\" class=\"btn btn-default removeCharacter\">Remove</a></div>"+
                "<div class=\"btn-group btn-group-justified confirmButtons\">"+
                  "<a type=\"button\" class=\"btn btn-success cancelButton\">Cancel</a>"+
                  "<a type=\"button\" class=\"btn btn-danger confirmButton\">Remove</a>"+
                "</div><p class=\"nameContainer lead\"></p></li>");
		
		var template = jQuery("#"+identifier);

		imageUrl = imageUrl.split("/");
		imageUrl = imageUrl[imageUrl.length-1];
		imageUrl = "images/"+imageUrl;

		template.css("background", 'url('+imageUrl+') center center');
		template.css("-webkit-background-size", "cover");
		template.css("-moz-background-size", "cover;");
		template.css("-o-background-size", "cover;");
		template.css("background-size:", "cover");

		template.find(".nameContainer").text(name);

		template.find(".confirmButtons").fadeOut(0);
		template.find(".removeCharacter").data("identifier", identifier);
		template.find(".cloneCharacter").data("identifier", identifier);
		template.data("identifier", identifier);

		template.find(".removeCharacter").click(function()
		{
			Gui.BeginRemoveCharacter(jQuery(this).data("identifier"));
		});
		template.find(".cloneCharacter").click(function()
		{
			CharacterStore.CloneCharacter(jQuery(this).data("identifier"));
		})
		return template;
		//jQuery(".neatgridster .firstRound").append(template);
	},
	BeginRemoveCharacter: function(identifier)
	{
		var target =jQuery("#"+identifier);
		target.find(".cloneRemoveButtons").fadeOut(function()
		{
			target.find(".confirmButtons a").unbind();

			target.find(".cancelButton").click(function()
			{
				target.find(".confirmButtons").fadeOut(function()
				{
					target.find(".cloneRemoveButtons").fadeIn();
				});
			});

			target.find(".confirmButtons .confirmButton").click(function()
			{
				Gui.EndRemoveCharacter(identifier);
			});

			target.find(".confirmButtons").fadeIn();
		})
		
	},
	EndRemoveCharacter: function(identifier)
	{
		var target =jQuery("#"+identifier);		
		Gridster.remove_widget(target);
		CharacterStore.RemoveCharacter(identifier);
	},
	RemoveAllCharacters: function()
	{
		Gridster.remove_all_widgets();
	},
	UpdateFromStorage: function()
	{
		Gui.RemoveAllCharacters();
		for(var i=0; i<Characters.length; i++)
		{
			var character = Characters[i];
			Gui.AddNewCharacter(character);
		}
	}
}