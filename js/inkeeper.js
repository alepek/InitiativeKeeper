$(function(){ //DOM Ready
 
    $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [180, 180],
        max_cols:8,        
    });
    Gridster = $(".gridster ul").gridster().data('gridster');
 
 	jQuery(".addNewCharacter").click(function()
 	{
 		jQuery("#createCharacterModal").modal("show");
 		jQuery(".characterImages .thumbnail.active").removeClass("active");
 		jQuery("#characterNameInput").val("");
 	});
 	jQuery("#createNewCharacterButton").click(function()
 	{
 		var name = jQuery("#characterNameInput").val();
 		var image = jQuery(".characterImages .active img").prop("src");

 		if(!name || !image)
 		{
 			return;
 		}

 		var identifier = CharacterStore.GetNewCharacterIdentifier();
 		CharacterStore.AddNewCharacter(name, identifier, image);
 		Gui.AddNewCharacter(name, identifier, image);
 		jQuery("#createCharacterModal").modal("hide");
 	});
 	jQuery(".characterImages .thumbnail").click(function()
 	{
		jQuery(".characterImages .thumbnail.active").removeClass("active");
		jQuery(this).addClass("active");
 	});
});



CharacterStore = 
{
	Characters: [],
	GetNewCharacterIdentifier: function()
	{
		return guid();
	},
	AddNewCharacter: function(name, identifier, imageUrl)
	{
		var character = {};
		character.name = name;
		character.identifier = identifier;
		character.imageUrl = imageUrl;
		CharacterStore.Characters.push(character);
	},
	RemoveCharacter: function(identifier)
	{
		for(var i=0;i<CharacterStore.Characters.length;i++)
		{
			if(CharacterStore.Characters[i].identifier == identifier)
			{
				return CharacterStore.Characters.splice(i,1);
			}
		}
		return false;
	},
	GetCharacter: function(identifier)
	{
		for(var i=0;i<CharacterStore.Characters.length;i++)
		{
			if(CharacterStore.Characters[i].guid == identifier)
			{
				return CharacterStore.Characters[i];
			}
		}
		return false;
	},
	CloneCharacter: function(identifier)
	{
		//var newCharacter = CharacterStore.GetCharacter(identifier);
	}
}

Gui =
{
	AddNewCharacter: function(name, identifier, imageUrl)
	{
		Gridster.add_widget("<li id="+identifier+" data-row=\"1\" data-col=\"1\" data-sizex=\"1\" data-sizey=\"1\" class=\"slightBorder character\">"+
                "<div class=\"btn-group btn-group-justified cloneRemoveButtons\">"+
                "<a type=\"button\" class=\"btn btn-default \">Clone</a>"+
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
		template.data("identifier", identifier);

		template.find(".removeCharacter").click(function()
		{
			var curId = jQuery(this).data("identifier");
			Gui.RemoveCharacter(curId);
		});

		//jQuery(".neatgridster .firstRound").append(template);
	},
	RemoveCharacter: function(identifier)
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
				CharacterStore.RemoveCharacter(identifier);
				Gridster.remove_widget(target);
			});

			target.find(".confirmButtons").fadeIn();
		})
		
	},
	CloneCharacter: function(identifier)
	{
		// NYI
	}
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}