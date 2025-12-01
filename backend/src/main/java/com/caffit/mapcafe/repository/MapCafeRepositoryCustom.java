package com.caffit.mapcafe.repository;

import com.caffit.mapcafe.domain.MapCafe;
import java.util.List;

public interface MapCafeRepositoryCustom {
    List<MapCafe> findWithinRadius(double lat, double lng, int radiusMeters);
}
