$(function(){ //DOM Ready
 
 	restorePreviousState();

 	jQuery(".addNewCharacterButton").click(function()
 	{
 		jQuery("#createCharacterModal").modal("show");
 		jQuery(".characterImages .thumbnail.active").removeClass("active");
 		jQuery("#characterNameInput").val("");
 	});
 	jQuery("#createNewCharacterButton").click(function()
 	{
 		var name = jQuery("#characterNameInput").val();
 		var image = jQuery(".characterImages .thumbnail.active img").prop("src");

 		if(!name || !image)
 		{
 			return;
 		}

 		var identifier = CharacterStore.GetNewCharacterIdentifier();
 		var character = {name:name, identifier:identifier, imageUrl:image, modifier:0, initiative: 0, actions: 1};
 		CharacterStore.AddNewCharacter(character);
 		Gui.AddNewCharacter(character);
 		jQuery("#createCharacterModal").modal("hide");
 	});
 	jQuery("#characterImageUrlInput").change(function()
 	{
 		var imageUrl = jQuery(this).val();
 		jQuery("#previewMyOwnImage").prop("src", imageUrl);
 	});

 	jQuery(".removeCharactersButton").click(function()
 	{
 		Modals.UpdateRemoveCharactersModal();

 		jQuery("#removeCharacterModal").modal("show");
 	});

 	jQuery("#removeCharactersButton").click(function()
 	{
 		var selected = Modals.GetChosenCharacterIdentifiers();
 		for(var i=0;i<selected.length;i++)
 			CharacterStore.RemoveCharacter(selected[i]);
 		Gui.UpdateFromStorage();
 		jQuery("#removeCharacterModal").modal("hide");
 	});

 	jQuery(".setInitiativesButton").click(function()
 	{
 		Modals.PopulateInitiativeInput();
 		var selected = jQuery("#ruleSystemSelect").val();
 		if(selected != "manual")
 		{
 			var inorder = jQuery("#initiativesModal .initiativeOrder");
 			var initiatives = jQuery("#initiativesModal .initiative");
 			inorder.prop("disabled", true);
 			initiatives.prop("disabled", true);
 			inorder.prop("selectedIndex", 0);
 		}
 		jQuery("#initiativesModal").modal("show");
 	});
 	jQuery("#ruleSystemSelect").change(function()
 	{
 		var inorder = jQuery("#initiativesModal .initiativeOrder");
 		var initiatives = jQuery("#initiativesModal .initiative");

 		var selected = jQuery(this).val();
 		if(selected != "manual")
 		{
 			inorder.prop("disabled", true);
 			initiatives.prop("disabled", true);
 			inorder.prop("selectedIndex", 0);
 		}
 		else
 		{
 			inorder.prop("disabled", false);
 			initiatives.prop("disabled", false);
 		}
 	});
 	jQuery("#calculateInitiativesButton, .rerollInitiatives").click(function()
 	{

 		var selected = jQuery("#ruleSystemSelect").val();
 		var initiatives = jQuery("#initiativesModal .initiative");
		if(initiatives.length != Characters.length)
		{
			Modals.PopulateInitiativeInput();
			initiatives = jQuery("#initiativesModal .initiative");
		}

 		if(selected != "manual")
 		{
 			var randomInitiatives = DiceRoller.GenerateRandomInitiatives(selected, initiatives.length);
 			
 			for(var i=0; i<initiatives.length; i++)
 			{
 				var field = jQuery(initiatives[i]);
 				field.val(randomInitiatives[i].result);
 			}
 		}

 		if(Modals.ValidateInitiativeInfo())
 		{
	 		Modals.WriteInitiativeInfoToCharacters();
	 		Gui.UpdatePhaseCalculation();
	 		jQuery("#initiativesModal").modal("hide");
 		}

 	});

 	jQuery(".characterImages .thumbnail").click(function()
 	{
		jQuery(".characterImages .thumbnail.active").removeClass("active");
		jQuery(this).addClass("active");
 	});


 	
});

function calculateInitiatives(highestFirst)
{
	// calculates initiative and returns a multidimensional array with the order for each phase.
	// the characters are assumed to be up-to-date with input at this point.
	var phases = [];

	var lowSorter = function(a,b)
	{
		var initA = a.initiative + a.modifier;
		var initB = b.initiative + b.modifier;
		var result = initA - initB;

		var random = Math.ceil(Math.random()-0.5)
		if(result === 0) // so they've tied, let's randomize it.
		{
			if(random === 1)
				return -1;
			return 1;
		}

		return result;
	}
	var highSorter = function(a,b)
	{
		var initA = a.initiative + a.modifier;
		var initB = b.initiative + b.modifier;
		var result = initB - initA;

		var random = Math.ceil(Math.random()-0.5)
		if(result === 0) // so they've tied, let's randomize it.
		{
			if(random === 1)
				return -1;
			return 1;
		}

		return result;
	}

	for(var i=0; i<Characters.length; i++)
	{
		var character = Characters[i];
		var actions = character.actions;
		for(var k=0;k<actions; k++)
		{
			if(!phases[k])
				phases[k] = [];

			phases[k].push(character);
		}
	}

	for(var i=0;i<phases.length; i++)
	{
		if(highestFirst)
			phases[i].sort(highSorter);
		else
			phases[i].sort(lowSorter);			
	}

	return phases;
}

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
		CharacterStore.AddNewCharacter(c);
	}
	Gui.UpdateFromStorage();
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


