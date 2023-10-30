import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import usePrevious from '@hooks/usePrevious';
import useLocalize from '@hooks/useLocalize';
import lodashGet from 'lodash/get';
import Navigation from '@libs/Navigation/Navigation';
import styles from '@styles/styles';
import ROUTES from '@src/ROUTES';
import FormHelpMessage from './FormHelpMessage';
import MenuItemWithTopDescription from './MenuItemWithTopDescription';

const propTypes = {
    /** Form error text. e.g when no country is selected */
    errorText: PropTypes.string,

    /** Callback called when the country changes. */
    onInputChange: PropTypes.func.isRequired,

    /** Callback called when the selector is dismissed. */
    onBlur: PropTypes.func,

    /** Current selected country  */
    value: PropTypes.string,

    /** inputID used by the Form component */
    // eslint-disable-next-line react/no-unused-prop-types
    inputID: PropTypes.string.isRequired,

    /** React ref being forwarded to the MenuItemWithTopDescription */
    forwardedRef: PropTypes.func,
};

const defaultProps = {
    errorText: '',
    onBlur: undefined,
    value: undefined,
    forwardedRef: () => {},
};

function CountrySelector({errorText, value: countryCode, onInputChange, onBlur, forwardedRef}) {
    const {translate} = useLocalize();

    const title = countryCode ? translate(`allCountries.${countryCode}`) : '';
    const countryTitleDescStyle = title.length === 0 ? styles.textNormal : null;

    const activeRouteName = useNavigationState(state => lodashGet(state, ['routes', state.index, 'name']));
    const isFocused = activeRouteName === 'Settings_PersonalDetails_Address_Country';
    const prevFocused = usePrevious(isFocused);

    useEffect(() => {
        // This will cause the form to revalidate and remove any error related to country name
        onInputChange(countryCode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countryCode]);

    useEffect(() => {
        // A blur is detected when focused changes from true to false.
        if (prevFocused && isFocused === false && onBlur) {
            onBlur();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused, prevFocused]);

    return (
        <View>
            <MenuItemWithTopDescription
                shouldShowRightIcon
                title={title}
                ref={forwardedRef}
                descriptionTextStyle={countryTitleDescStyle}
                description={translate('common.country')}
                onPress={() => {
                    const activeRoute = Navigation.getActiveRoute().replace(/\?.*/, '');
                    Navigation.navigate(ROUTES.SETTINGS_PERSONAL_DETAILS_ADDRESS_COUNTRY.getRoute(countryCode, activeRoute));
                }}
            />
            <View style={styles.ml5}>
                <FormHelpMessage message={errorText} />
            </View>
        </View>
    );
}

CountrySelector.propTypes = propTypes;
CountrySelector.defaultProps = defaultProps;
CountrySelector.displayName = 'CountrySelector';

const CountrySelectorWithRef = React.forwardRef((props, ref) => (
    <CountrySelector
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        forwardedRef={ref}
    />
));

CountrySelectorWithRef.displayName = 'CountrySelectorWithRef';

export default CountrySelectorWithRef;
