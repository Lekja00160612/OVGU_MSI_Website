export interface ThesisTopic {
  id: number
  title: string
  module: string
  description: string
  tasks: string[]
}

export const thesisTopics: ThesisTopic[] = [
  {
    id: 1,
    title: 'Production of self-cleaning glass by using thin film coating',
    module: 'Glass Technology & Engineering',
    description: 'Self-cleaning glass has the property of using rainwater to clean itself. This effect is based on special coating on glass, either making glass surfaces hydrophobic like lotus leaf, or using the TiO2-thin layer which can produce active oxygen and burn away all organic substances on the glass surface.',
    tasks: [
      'Set up the coating machine in cooperation with lab-engineer',
      'Select coating materials, carry out the coating experiments and analyze the results'
    ]
  },
  {
    id: 2,
    title: 'Production of transparent and conductive glass by ITO-coating',
    module: 'Glass Technology & Engineering',
    description: 'Indium doped tin oxide (ITO) is well known as a transparent and conductive material. It has a wide range of applications like in the production of screens and monitors.',
    tasks: [
      'Set up the coating machine in cooperation with lab-engineer',
      'Select coating materials, carry out the coating experiments and analyze the results'
    ]
  },
  {
    id: 3,
    title: 'Production of UV and IR protecting glasses',
    module: 'Glass Technology & Engineering',
    description: 'UV and IR protective glasses are used widely, especially in building facades. The common method uses UV- and IR absorbents in glass.',
    tasks: [
      'Analyze and compare the effectiveness of different materials',
      'Make UV and IR glasses by mixing the batch and melting glass',
      'Produce flat glass samples and analyze their effect of UV/IR protection'
    ]
  },
  {
    id: 4,
    title: 'Production of Gorilla glass by ion-exchange',
    module: 'Glass Technology & Engineering',
    description: 'Gorilla glass is well known as a glass that has extremely high hardness and strength and is used for mobile phone screens.',
    tasks: [
      'Set up equipment and produce gorilla glass from float glass using the method of ion-exchange',
      'Analyze the result using strength tests'
    ]
  },
  {
    id: 5,
    title: 'Production of glass ceramic / Mosaic glass for building application',
    module: 'Glass Technology & Engineering',
    description: 'Glass-ceramic is a special ceramic with much higher strength than glass but made according to glass technology. There are two common types of glass ceramic for building applications: fluoride and wollastonite glass-ceramic.',
    tasks: [
      'Mix and melt a wollastonite glass-ceramic according to well-known glass technology',
      'Analyze structural properties and mechanical performance'
    ]
  },
  {
    id: 6,
    title: 'Production of micro glass beads for reflectors in optical application',
    module: 'Glass Technology & Engineering',
    description: 'Reflection beads are mostly made from transparent glass powder with a diameter of 0.1–2 mm. They are mixed into colored paint and applied to road surfaces or signs. At night, when illuminated by lights, they reflect light back like mirrors according to the principle of total reflection, increasing visibility.',
    tasks: [
      'Start with glass powder and test various rounding technologies (such as flame processing and rotary kilns) for the production of spherical beads',
      'Evaluate optical reflection and morphological results'
    ]
  },
  {
    id: 7,
    title: 'FEM Simulation of the annealing process of glass bottles',
    module: 'Glass Technology & Engineering',
    description: 'FEM simulation becomes an important part of product and process development, especially in the modern era of Industry 4.0, where production processes (thermic, mechanics, electrics...) can be simulated and developed using Multiphysics FEM tools like ANSYS Workbench.',
    tasks: [
      'Use FEM code ANSYS to simulate heating and cooling processes in an annealing furnace of glass bottles',
      'Study the influence of temperature and cooling rate on residual thermal stress in bottles (viscoelastic material)'
    ]
  },
  {
    id: 8,
    title: 'FEM Simulation of the heat transfer through double-glazing windows',
    module: 'Glass Technology & Engineering',
    description: 'Glass windows belong to the most important parts of building construction. Besides their elegant look, they must give the building sufficient natural light, superior insulation in hot/cold weather, and reduce energy consumption.',
    tasks: [
      'Study different constructions of glass windows',
      'Simulate heat transfer through glass windows on hot summer days',
      'Describe the effects of window constructions on heat transfer and thermal stress in glass sheets'
    ]
  }
]
