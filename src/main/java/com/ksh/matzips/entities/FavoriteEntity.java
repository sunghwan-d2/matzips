package com.ksh.matzips.entities;

import lombok.*;

@Getter
@Setter
@EqualsAndHashCode(of = {"userEmail","placeIndex"})
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteEntity {
    private String userEmail;
    private int placeIndex;
}
