// Updated trial data with your new passages and questions

const trial_info = {
    vocabulary_mouse_tracking: [
        {
            id: 1,
            title: "Basic Electric Circuits",
            passage: "Electric circuits need different parts to work properly. Resistance stops electricity from moving freely, like a small door that slows down people walking through it. Some materials let electricity move easily - these are called conductors. Copper wire is a good conductor because electricity can travel through it quickly. Other materials stop electricity completely - these are insulators. Rubber and plastic are insulators that keep us safe from electric shock. Current means electricity flowing through wires, like water flowing through a pipe. We measure current in amperes or 'amps.' Voltage is the force that pushes electricity through the circuit. It's like water pressure in pipes - more voltage means stronger push for the electricity.",
            questions: [
                {
                    question: "Voltage is the force that pushes electricity through circuits.",
                    correct: "True"
                },
                {
                    question: "Rubber materials, which function as electrical conductors due to their flexible molecular structure that allows current to flow freely through their polymer chains, are commonly used in electrical wiring applications.",
                    correct: "False"
                },
                {
                    question: "Engineers design circuits by understanding how voltage, current, and resistance work together to control electrical flow.",
                    correct: "True"
                }
            ]
        },
        {
            id: 2,
            title: "Material Strength",
            passage: "Engineers must choose the right materials for building things. Some materials break easily without bending first. These brittle materials are like dry cookies - they snap quickly. Glass and concrete are brittle materials. Other materials can bend and stretch before they break. These ductile materials are like chewing gum - they stretch a lot first. Metals like copper and aluminum are ductile. When forces pull something apart, we call this tensile stress. When forces push something together, this is compression stress. If the stress becomes too strong, the material will break. This breaking is called fracture. Engineers test materials to know how much stress they can handle before fracture happens.",
            questions: [
                {
                    question: "Ductile materials break suddenly without any bending or stretching.",
                    correct: "False"
                },
                {
                    question: "Tensile stress, which occurs when forces pull materials apart and create stretching forces within the material structure, differs from compression stress that pushes materials together and attempts to reduce their volume.",
                    correct: "True"
                },
                {
                    question: "Engineers select brittle materials like concrete for applications requiring flexibility and bending resistance.",
                    correct: "False"
                }
            ]
        },
        {
            id: 3,
            title: "Heat Movement",
            passage: "Heat moves from hot places to cold places in three main ways. Conduction happens when heat moves through solid things by touch. When you hold one end of a metal spoon and put the other end in hot soup, heat travels through the metal to your hand. This is conduction. Convection happens in liquids and gases. Hot air rises up and cold air goes down, making circles of moving air. This moving carries heat around. Radiation sends heat through empty space without touching anything. The sun heats Earth this way. Thermal is a word that means 'about heat.' Engineers study thermal properties of materials. Dissipation means heat spreads out and becomes weaker. Like when hot coffee slowly becomes room temperature - the heat dissipates into the air.",
            questions: [
                {
                    question: "Radiation requires direct contact between materials to transfer heat.",
                    correct: "False"
                },
                {
                    question: "Thermal dissipation, which involves the gradual distribution and weakening of heat energy throughout surrounding environments via molecular interactions and energy transfer mechanisms, occurs through conduction, convection, and radiation processes.",
                    correct: "True"
                },
                {
                    question: "Engineers apply only conduction principles when designing cooling systems, ignoring convection and radiation effects.",
                    correct: "False"
                }
            ]
        },
        {
            id: 4,
            title: "Building Structures",
            passage: "Buildings must be strong enough to hold weight without falling down. Any weight that pushes on a building is called a load. People, furniture, snow, and wind all create loads. A beam is a long, strong piece that goes across spaces to hold up loads. Think of a beam like a bridge between two walls. When loads push down on beams, the beams bend a little bit. This bending is called deflection. Too much deflection is dangerous. Stability means the building stays steady and doesn't fall over, even when wind pushes on it or people move around inside. Sometimes engineers add extra strong materials to weak parts. This extra strength is called reinforcement. Steel bars inside concrete are common reinforcement that help buildings stay strong and stable for many years.",
            questions: [
                {
                    question: "Deflection means a beam stays perfectly straight under any load.",
                    correct: "False"
                },
                {
                    question: "Structural deflection, which represents the measurable displacement and deformation of load-bearing elements when subjected to applied forces, must be controlled within acceptable engineering limits to maintain stability and serviceability requirements.",
                    correct: "True"
                },
                {
                    question: "Reinforcement materials always make structures weaker and should be avoided in building design.",
                    correct: "False"
                }
            ]
        },
        {
            id: 5,
            title: "Making Things Precisely",
            passage: "Factories make parts that must fit together perfectly. Machining means cutting and shaping materials with special tools to make exact shapes. Like using a very precise knife to cut materials into the right size. Tolerance tells workers how close to perfect the part must be. If a part should be 10 centimeters long, tolerance might allow it to be between 9.9 and 10.1 centimeters. Precision means making things exactly the right size, shape, and smoothness. Calibration keeps measuring tools working correctly. Workers check their rulers and measuring devices regularly to make sure they show true measurements. Quality control means checking finished parts to make sure they meet all requirements. Workers measure, test, and inspect parts before sending them to customers.",
            questions: [
                {
                    question: "Precision means making things approximately the right size with large variations allowed.",
                    correct: "False"
                },
                {
                    question: "Manufacturing precision, which requires dimensional accuracy within specified tolerance parameters, depends on systematic calibration procedures for measuring instruments and machining equipment to maintain consistent quality control standards.",
                    correct: "True"
                },
                {
                    question: "Quality control systems only check finished products and ignore the machining and calibration processes during manufacturing.",
                    correct: "False"
                }
            ]
        }
    ]
};