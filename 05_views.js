// In this file, we define the sequence of views in the experiment 

const views_seq = [
    // Intro view
    intro = magpieViews.view_generator("intro", {
        trials: 1,
        name: 'intro',
        text: `Welcome to the study.`,
        buttonText: "Begin"
    }),

    // Custom comprehension with demographics first
    {
        name: 'main_experiment',
        render: function(CT, magpie) {
            // Call the custom start function (which shows demographics first)
            vocabulary_mouse_tracking_function({
                trials: trial_info.vocabulary_mouse_tracking,
                name: 'main_experiment'
            }).start(magpie);
        }
    },

    // End screen
    thanks = magpieViews.view_generator("thanks", {
        trials: 1,
        name: 'thanks',
        title: "Thank you for your participation!",
        text: "Your responses have been successfully recorded and will contribute to our research on cognitive load patterns in ESL vocabulary acquisition."
    })
];