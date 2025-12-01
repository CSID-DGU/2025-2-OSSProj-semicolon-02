package com.caffit.mapcafe.repository;

import com.caffit.mapcafe.domain.MapCafe;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MapCafeRepositoryImpl implements MapCafeRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<MapCafe> findWithinRadius(double lat, double lng, int radiusMeters) {
        return em.createQuery("""
            SELECT c FROM MapCafe c
            WHERE function('ST_Distance_Sphere',
                           point(:lng, :lat),
                           point(c.lng, c.lat)
                   ) <= :radius
            """, MapCafe.class)
            .setParameter("lat", lat)
            .setParameter("lng", lng)
            .setParameter("radius", radiusMeters)
            .getResultList();
    }
}
