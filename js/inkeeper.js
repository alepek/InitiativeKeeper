$(function(){ //DOM Ready
 
    $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [180, 180],
        max_cols:8,        
    });
    Gridster = $(".gridster ul").gridster().data('gridster');
 
 	restorePreviousState();

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
 	jQuery(".clearStoredCharacters").click(function()
 	{
		jQuery("#removeCharactersModal").modal("show");
 	});
 	jQuery("#removeAllCharactersButton").click(function()
 	{
 		CharacterStore.ClearCharacters();
 		Gui.RemoveAllCharacters();
		jQuery("#removeCharactersModal").modal("hide");
 	});
 	jQuery(".characterImages .thumbnail").click(function()
 	{
		jQuery(".characterImages .thumbnail.active").removeClass("active");
		jQuery(this).addClass("active");
 	});
 	
});

function restorePreviousState(){

	if(!Modernizr.localstorage)
	{
		jQuery("#noLocalStoreSupport").modal("show");
		return;
	}

	var characters = CharacterStore.GetCharactersInLocalStore();
	if(!characters)
		return;

	for(var i=0;i<characters.length; i++)
	{
		var c = {};
		jQuery.extend(true, c, characters[i]);
		CharacterStore.AddNewCharacter(c.name, c.identifier, c.imageUrl);
	}
	Gui.UpdateFromStorage();
}

Characters = [];
Characters.push = function()
{	
	var result = Array.prototype.push.apply(this,arguments);
	CharacterStore.SyncLocalStore();
	return result;
};
Characters.splice = function()
{	
	var result = Array.prototype.splice.apply(this,arguments);
	CharacterStore.SyncLocalStore();
	return result;
};

CharacterStore = 
{
	lsKey: "inKeeperCharacters",	


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
		Characters.push(character);
	},
	RemoveCharacter: function(identifier)
	{
		for(var i=0;i<Characters.length;i++)
		{
			if(Characters[i].identifier == identifier)
			{
				return Characters.splice(i,1);
			}
		}
		return false;
	},
	GetCharacter: function(identifier)
	{
		for(var i=0;i<Characters.length;i++)
		{
			if(Characters[i].guid == identifier)
			{
				return Characters[i];
			}
		}
		return false;
	},
	ClearCharacters: function()
	{
		Characters.splice(0, Characters.length);
	},
	CloneCharacter: function(identifier)
	{
		//var newCharacter = CharacterStore.GetCharacter(identifier);
	},

	SyncLocalStore: function()
	{
		if(!Modernizr.localstorage)
			return;

		localStorage[CharacterStore.lsKey] = JSON.stringify(Characters);
	},
	GetCharactersInLocalStore: function()
	{
		if(!Modernizr.localstorage)
			return;

		var cs =localStorage[CharacterStore.lsKey];
		if(!cs || !cs.length)
			return;

		var characters = JSON.parse(cs);
		return characters;
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
			Gui.BeginRemoveCharacter(curId);
		});

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
		CharacterStore.RemoveCharacter(identifier);
		Gridster.remove_widget(target);
	},
	RemoveAllCharacters: function()
	{
		jQuery(".firstRound .character").each(function()
		{
			var id = jQuery(this).prop("id");
			Gui.EndRemoveCharacter(id);
		});
	},
	CloneCharacter: function(identifier)
	{
		// NYI
	},
	UpdateFromStorage: function()
	{
		Gui.RemoveAllCharacters();
		for(var i=0; i<Characters.length; i++)
		{
			var character = Characters[i];
			Gui.AddNewCharacter(character.name, character.identifier, character.imageUrl);
		}
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