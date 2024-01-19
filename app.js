import QuestionnaireBuilder from "./Questionare";

 let builder = new QuestionnaireBuilder('questionnaire-builder');

$('#add-section-button').on('click', function () {
   builder.createSection();
});

$('#save-questionnaire-button').on('click', function () {
  let data = builder.serialize();
  //...
});

 const val = $('#questionnaire-builder').attr('data-content');
 builder.initialize();
 if (val.length > 2) {
    builder.deserialize('[' + val + ']');
 }
