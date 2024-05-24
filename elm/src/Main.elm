module Main exposing (..)

import Browser
import Html exposing (Html, div, text, button, textarea, p, i)
import Html.Attributes exposing (class, placeholder, value, id, attribute)
import Html.Events exposing (onClick, onInput)


-- MODEL

type alias Model =
    { leftInput : String
    , rightInput : String
    , result : String
    }


init : Model
init =
    { leftInput = ""
    , rightInput = ""
    , result = ""
    }


-- UPDATE

type Msg
    = UpdateLeftInput String
    | UpdateRightInput String
    | Compare


update : Msg -> Model -> Model
update msg model =
    case msg of
        UpdateLeftInput input ->
            { model | leftInput = input }

        UpdateRightInput input ->
            { model | rightInput = input }

        Compare ->
            if model.leftInput == model.rightInput then
                { model | result = "The contents are the same." }
            else
                { model | result = "The contents are different." }


-- VIEW

view : Model -> Html Msg
view model =
    div [ class "container mt-5" ]
        [ div [ class "row" ]
            [ div [ class "col" ]
                [ div [ class "form-group" ]
                    [ label "Left Textarea"
                    , textarea [ class "form-control", id "leftTextarea", attribute "rows" "10", placeholder "Enter left text", value model.leftInput, onInput UpdateLeftInput ] []
                    ]
                ]
            , div [ class "col" ]
                [ div [ class "form-group" ]
                    [ label "Right Textarea"
                    , textarea [ class "form-control", id "rightTextarea", attribute "rows" "10", placeholder "Enter right text", value model.rightInput, onInput UpdateRightInput ] []
                    ]
                ]
            ]
        , div [ class "text-center mt-3" ]
            [ button [ class "btn btn-primary me-2", onClick Compare ]
                [ i [ class "bi bi-arrows-angle-contract me-2" ] []
                , text "Compare"
                ]
            , p [ class "mt-3" ] [ text model.result ]
            ]
        ]


label : String -> Html msg
label content =
    Html.label [ class "form-label" ] [ text content ]


-- MAIN

main =
    Browser.sandbox { init = init, update = update, view = view }
