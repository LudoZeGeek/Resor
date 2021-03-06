<?php

namespace Resor\Bundle\CoreBundle\Controller;

use Resor\Bundle\CoreBundle\Entity\Offer;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class SearchController extends Controller
{
    /**
     * @Route("/", name="home")
     * @Template()
     */
    public function indexAction()
    {
        return array();
    }

    /**
     * @Route("/results", name="results")
     * @Template()
     */
    public function resultsAction(Request $request)
    {
        $place = $request->query->get('place');
        $lat = $request->query->get('lat');
        $lng = $request->query->get('lng');
        $from = $request->query->get('from');
        $to = $request->query->get('to');
        return array(
            "place" => $place,
            "lat" => $lat,
            "lng" => $lng,
            "from" => $from,
            "to" => $to
        );
    }

    /**
     * @Route("/api/results", name="resultsApi")
     * @Template()
     */
    public function resultsGetAction(Request $request)
    {
        $response = new JsonResponse();

        $lat = $request->query->get('lat');
        $lng = $request->query->get('lng');
        $from = $request->query->get('from');
        $to = $request->query->get('to');


        $repo = $this->getDoctrine()
            ->getManager()
            ->getRepository('ResorCoreBundle:Offer');
        $offers = $repo->findAround($lat, $lng);

        $serializer = $this->container->get('serializer');
        $sOffers = $serializer->serialize($offers, 'json');

        $response->setData([
            'results' => $sOffers
        ]);

        return $response;
    }

}
