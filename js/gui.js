
Gui =
{
	fadeTime: 250,
	AddNewCharacter: function(character, delay){
		var imageUrl= character.imageUrl;
		var name = character.name;
		var identifier = character.identifier;
		var template = jQuery("#templateContainer .tinyCharacterContainer").clone();

		//imageUrl = imageUrl.split("/");
		//imageUrl = imageUrl[imageUrl.length-1];
		//imageUrl = "images/"+imageUrl;

		var thumbnail = template.find("img");
		thumbnail.attr("src", imageUrl);

		template.find(".nameContainer").text(name);
		template.data("identifier", identifier);
		template.transition({ opacity: 0 }, 0);
		jQuery("#characters").append(template);


		if(delay)
			template.delay(delay).transition({ opacity: 1 }, Gui.fadeTime);
		else
			template.transition({ opacity: 1 }, Gui.fadeTime);
		//jQuery(".neatgridster .firstRound").append(template);
	},
	BeginRemoveCharacter: function(identifier)
	{
		var target =jQuery("#"+identifier);
		target.find(".cloneRemoveButtons").transition({ opacity: 0 }, Gui.fadeTime, function()
		{
			target.find(".confirmButtons a").unbind();

			target.find(".cancelButton").click(function()
			{
				target.find(".confirmButtons").transition({ opacity: 0 }, Gui.fadeTime, function()
				{
					target.find(".cloneRemoveButtons").transition({ opacity: 1 }, Gui.fadeTime);
				});
			});

			target.find(".confirmButtons .confirmButton").click(function()
			{
				Gui.EndRemoveCharacter(identifier);
			});

			target.find(".confirmButtons").transition({ opacity: 1 }, Gui.fadeTime);
		});		
	},
	EndRemoveCharacter: function(identifier)
	{
		var target =jQuery("#"+identifier);
		CharacterStore.RemoveCharacter(identifier);
	},
	RemoveAllCharacters: function()
	{
		jQuery("#characters .tinyCharacterContainer").remove();
	},
	UpdateFromStorage: function()
	{
		Gui.RemoveAllCharacters();
		for(var i=0; i<Characters.length; i++)
		{
			var character = Characters[i];
			var added = Gui.AddNewCharacter(character, i*50);
		}
	},

	UpdatePhaseCalculation: function()
	{
		var phases = calculateInitiatives(Modals.initiativeOrder === Modals.high);
		Gui.CreatePhasesAndOrder(phases);
	},
	CreatePhasesAndOrder: function(phasesAndCharacters)
	{

		var phases = jQuery("#phasesContainer");
		phases.transition({ opacity: 0 }, Gui.fadeTime, function()
		{
			phases.empty().transition({ opacity: 1 }, 0);
			var container = jQuery("<div></div>");
			for(var i=0; i<phasesAndCharacters.length; i++)
			{
				var phaseTemplate = jQuery("#templateContainer .phaseTemplate").clone();
				phaseTemplate.find(".phaseNumber").text(i+1);

				var c = phasesAndCharacters[i];
				for(var k=0; k<c.length; k++)
				{
					var character = c[k];
					var imageUrl= character.imageUrl;
					var name = character.name;
					var initiative = character.initiative;
					var modifier = character.modifier;
					var total = initiative + modifier;

					var template = jQuery("#templateContainer .characterContainer").clone();

					var thumbnail = template.find("img");
					thumbnail.attr("src", imageUrl);

					template.find(".nameContainer").text(name);
					template.find(".initiativeNumber").text( "(" + total +")");

					template.transition({ opacity: 0 }, 0);	
					template.delay(k*50).transition({ opacity: 1 }, Gui.fadeTime);
					phaseTemplate.append(template);
				}
				container.append(phaseTemplate);
			}
			phases.append(container.children());
		});
	}
};
Modals =
{
	initiativeOrder: "high",
	high: "high",
	low: "low",
	UpdateRemoveCharactersModal: function()
	{
		var starget = jQuery("#removeCharacterModal .charactersToRemoveImages").empty();

		var c = Characters;
		var onclick = function()
		{
			var t = jQuery(this);
			if(jQuery(this).hasClass("active"))
				t.removeClass("active");
			else
				t.addClass("active");
		};
		for(var i=0; i<c.length; i++)
		{
			var template = jQuery("#templateContainer .modalRemoveCharacter").clone();
			var thumb = template.find(".thumbnail");
			thumb.data("identifier", c[i].identifier);
			thumb.find(".nameContainer").text(c[i].name);
			thumb.find("img").prop("src", c[i].imageUrl);

			thumb.click(onclick);
			starget.append(template);
		}
	},
	GetChosenCharacterIdentifiers: function()
	{
		var target = jQuery("#removeCharacterModal .charactersToRemoveImages");

		var boxes = target.find(".active");
		var selected = [];
		for(var i=0;i<boxes.length;i++)
		{
			var id = jQuery(boxes[i]).data("identifier");
			selected.push(id);
		}
		return selected;
	},
	PopulateInitiativeInput: function()
	{
		var target = jQuery("#initiativesModal .characterList").empty();

		var c = Characters;
		var container = "<div></div>";
		container = jQuery(container);
		for(var i=0; i<c.length; i++)
		{
			var clone = jQuery("#templateContainer .initiativeInput").clone();
			clone.find(".characterName").text(c[i].name);
			clone.find(".characterName").data("identifier", c[i].identifier);

			if(c[i].actions)
				clone.find(".actions").prop("value", c[i].actions);
			else
				clone.find(".actions").prop("value", 1);


			if(c[i].modifier)
				clone.find(".modifier").prop("value", c[i].modifier);
			else
				clone.find(".modifier").prop("value", 0);


			if(c[i].initiative)
				clone.find(".initiative").prop("value", c[i].initiative);

			container.append(clone);
		}
		target.append(container.children());
	},
	ValidateInitiativeInfo: function()
	{
		var target = jQuery("#initiativesModal .characterList");
		var inputs = target.find(".initiativeInput");
		if(!inputs.length)
			return false;

		var testForNumber = function(num)
		{
			if(num === "")
				return true;
			if(isNaN(num))
				return false;

			return true;
		};

		for(var i=0;i<inputs.length;i++)
		{
			target = jQuery(inputs[i]);
			var identifier = target.find(".characterName").data("identifier");
			var initiative = target.find(".initiative").val();
			var modifier = target.find(".modifier").val();
			var actions = target.find(".actions").val();

			if(!identifier)
				return false;
			if(!testForNumber(initiative) || initiative === "")
				return false;
			if(!testForNumber(modifier))
				return false;
			if(!testForNumber(actions))
				return false;
			if(actions === "0" || actions === 0 || parseInt(actions, 10) <= 0)
				return false;
		}
		return true;
	},
	WriteInitiativeInfoToCharacters: function()
	{
		var target = jQuery("#initiativesModal .characterList");
		var inputs = target.find(".initiativeInput");
		for(var i=0;i<inputs.length;i++)
		{
			target = jQuery(inputs[i]);
			var identifier = target.find(".characterName").data("identifier");
			var initiative = target.find(".initiative").val();
			var modifier = target.find(".modifier").val();
			var actions = target.find(".actions").val();

			if(!modifier)
				modifier = 0;
			if(!actions)
				actions = 1;

			var initiativeItem = 
			{
				identifier:identifier,
				initiative:parseInt(initiative, 10),
				modifier:parseInt(modifier, 10),
				actions:parseInt(actions, 10)
			};

			CharacterStore.AddValuesToCharacter(initiativeItem);
			CharacterStore.SyncLocalStore();
		}
		Modals.initiativeOrder = jQuery(".initiativeOrder").val();
	}
};