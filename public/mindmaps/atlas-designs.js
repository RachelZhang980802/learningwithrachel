// Six contrasting branch colours per article. Saturated headings + quiet reading surfaces.
const theme=(pattern,colours)=>({pattern,palette:colours.map(c=>c[0]),fills:colours.map(c=>c[1])});
export const designs={
 '01':theme('research-tree',[['#285EB0','#E4EEFF'],['#A85710','#FFF0D8'],['#157875','#DEF5EF'],['#8551A9','#F0E5FF'],['#B04753','#FFE6E8'],['#517821','#EDF5D8']]),
 '02':theme('argument-tree',[['#7049A9','#EEE4FF'],['#147883','#DFF4F6'],['#A6512E','#FFE9DB'],['#3E6BAC','#E4EEFF'],['#A1427F','#FBE3F0'],['#627320','#EFF3D7']]),
 '03':theme('life-stages',[['#AE4A36','#FFE5DC'],['#96610F','#FFF0D2'],['#346DA6','#E2F0FF'],['#8D4A96','#F6E5FA'],['#317960','#DFF4E9'],['#A43B70','#FDE1EF']]),
 '04':theme('appearance-reality',[['#A43C78','#FBE2F0'],['#A55229','#FFE9D9'],['#436CA1','#E6F0FF'],['#765EA4','#EEE8FF'],['#896716','#FFF3CD'],['#16776A','#DCF4EA']]),
 '05':theme('proposal-perspectives',[['#966015','#FFF0D5'],['#A9456A','#FFE2ED'],['#287872','#DDF5EE'],['#4D6BA4','#E5EFFF'],['#8952A5','#F2E6FC'],['#AD4A34','#FFE7DE']]),
 '06':theme('reader-writer',[['#187A62','#DCF4E9'],['#3B6DA7','#E0EDFF'],['#9A600E','#FFF0D0'],['#A84471','#FCE2EF'],['#7551AB','#EDE4FF'],['#A94D2F','#FFE7D9']]),
 '07':theme('urban-comparisons',[['#146E8B','#DCF1FB'],['#357643','#E2F3DE'],['#97600F','#FFF0CD'],['#7A52AB','#EDE3FF'],['#B04555','#FFE2E7'],['#1C7873','#DCF4F0']]),
 '08':theme('mechanism-consequence',[['#62731D','#EFF4D2'],['#386CAD','#E2EEFF'],['#AA4559','#FFE0E8'],['#874FA7','#F1E2FC'],['#A05C12','#FFF0D6'],['#177872','#DDF6EF']]),
 '09':theme('tourist-identity',[['#4D55A9','#E7E7FF'],['#A2562A','#FFEAD9'],['#1F7788','#DFF3FA'],['#A54178','#FCE2F1'],['#547629','#EEF5DA'],['#8B6712','#FFF1D1']]),
 '10':theme('paired-river',[['#246A89','#DFF1FB'],['#7553A9','#EEE5FF'],['#956310','#FFF1D3'],['#AC426A','#FFE2EC'],['#1B786D','#DCF4EC'],['#AA4F30','#FFE6DA']]),
};
